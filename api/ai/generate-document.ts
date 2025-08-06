import { VercelRequest, VercelResponse } from '@vercel/node';
import {
  generateLegalDocument,
  createSSEStream,
  checkRateLimit,
  type DocumentGenerationRequest,
} from '../../server/openai';
import { validateClientDetailsForDocument } from '../../prompts/index';

/**
 * Vercel Edge Function for AI-powered legal document generation
 * Supports both streaming (SSE) and non-streaming responses
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      documentType,
      clientDetails,
      customRequirements,
      userId,
      userPlan = 'starter',
      streaming = true,
    }: DocumentGenerationRequest & {
      userPlan?: 'starter' | 'pro' | 'enterprise';
      streaming?: boolean;
    } = req.body;

    // Validate required fields
    if (!documentType || !clientDetails) {
      res.status(400).json({
        error: 'Missing required fields: documentType and clientDetails are required',
      });
      return;
    }

    // Validate client details for the document type
    const validation = validateClientDetailsForDocument(documentType, clientDetails);
    if (!validation.isValid) {
      res.status(400).json({
        error: 'Invalid client details',
        details: validation.errors,
      });
      return;
    }

    // Check rate limits if userId is provided
    if (userId) {
      const rateLimitInfo = await checkRateLimit(userId, userPlan);

      if (rateLimitInfo.remaining === 0) {
        res.status(429).json({
          error: 'Rate limit exceeded',
          message: `You have reached your plan limit. Upgrade to Pro for unlimited document generation.`,
          resetTime: rateLimitInfo.resetTime,
          planType: rateLimitInfo.planType,
        });
        return;
      }

      // Include rate limit info in response headers
      res.setHeader('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
      res.setHeader('X-RateLimit-Reset', rateLimitInfo.resetTime.toISOString());
      res.setHeader('X-RateLimit-Plan', rateLimitInfo.planType);
    }

    // Generate the document
    const request: DocumentGenerationRequest = {
      documentType,
      clientDetails,
      customRequirements,
      userId,
    };

    if (streaming) {
      // Set up Server-Sent Events headers
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

      // Generate streaming response
      const openaiStream = await generateLegalDocument(request, { stream: true });

      if (!(openaiStream instanceof ReadableStream)) {
        throw new Error('Expected streaming response but got non-stream');
      }

      // Create SSE stream and pipe to response
      const sseStream = createSSEStream(openaiStream);
      const reader = sseStream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            res.end();
            break;
          }

          res.write(value);
        }
      } catch (streamError) {
        console.error('Streaming error:', streamError);
        const errorMessage = `data: ${JSON.stringify({
          type: 'error',
          error: 'Streaming interrupted',
          timestamp: Date.now(),
        })}\n\n`;
        res.write(errorMessage);
        res.end();
      } finally {
        reader.releaseLock();
      }
    } else {
      // Non-streaming response
      const result = await generateLegalDocument(request, { stream: false });

      if (typeof result !== 'string') {
        throw new Error('Expected non-streaming response but got stream');
      }

      res.status(200).json({
        success: true,
        document: result,
        documentType,
        generatedAt: new Date().toISOString(),
        metadata: {
          userId,
          userPlan,
          rateLimitRemaining: userId ? (await checkRateLimit(userId, userPlan)).remaining : null,
        },
      });
    }
  } catch (error) {
    console.error('Document generation error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const statusCode = errorMessage.includes('rate limit')
      ? 429
      : errorMessage.includes('validation')
        ? 400
        : 500;

    if (req.body?.streaming) {
      // Send error through SSE stream
      const errorData = `data: ${JSON.stringify({
        type: 'error',
        error: errorMessage,
        timestamp: Date.now(),
      })}\n\n`;
      res.write(errorData);
      res.end();
    } else {
      res.status(statusCode).json({
        error: 'Document generation failed',
        message: errorMessage,
      });
    }
  }
}

// Export configuration for Vercel
export const config = {
  runtime: 'nodejs18.x',
  maxDuration: 60, // 60 seconds for long document generation
  regions: ['syd1'], // Australia region for better latency
};
