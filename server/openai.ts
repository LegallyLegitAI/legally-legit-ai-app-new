import OpenAI from 'openai';
import type { ReadableStream } from 'stream/web';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface StreamingOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DocumentGenerationRequest {
  documentType: string;
  clientDetails: Record<string, any>;
  customRequirements?: string;
  userId?: string;
}

export interface RateLimitInfo {
  remaining: number;
  resetTime: Date;
  planType: 'starter' | 'pro' | 'enterprise';
}

// Default configuration for different document types
export const DEFAULT_CONFIG: StreamingOptions = {
  model: 'gpt-4o',
  temperature: 0.3,
  max_tokens: 4000,
  stream: true,
};

/**
 * Generate a chat completion with streaming support
 */
export async function generateCompletion(
  messages: ChatMessage[],
  options: StreamingOptions = {}
): Promise<OpenAI.Chat.Completions.ChatCompletion | ReadableStream> {
  const config = { ...DEFAULT_CONFIG, ...options };

  try {
    const completion = await openai.chat.completions.create({
      model: config.model!,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: config.temperature,
      max_tokens: config.max_tokens,
      stream: config.stream,
    });

    return completion;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to generate completion: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate legal document with streaming support for real-time generation
 */
export async function generateLegalDocument(
  request: DocumentGenerationRequest,
  options: StreamingOptions = {}
): Promise<ReadableStream | string> {
  const { documentType, clientDetails, customRequirements, userId } = request;
  
  // Get the appropriate prompt template
  const { getPromptTemplate } = await import('../prompts/index.js');
  const promptTemplate = getPromptTemplate(documentType);
  
  if (!promptTemplate) {
    throw new Error(`Unsupported document type: ${documentType}`);
  }

  // Build the system message with the template
  const systemMessage: ChatMessage = {
    role: 'system',
    content: promptTemplate.buildPrompt(clientDetails, customRequirements),
  };

  // Build user message
  const userMessage: ChatMessage = {
    role: 'user',
    content: `Generate a ${documentType} document for an Australian business with the following details: ${JSON.stringify(clientDetails, null, 2)}${customRequirements ? `\n\nAdditional requirements: ${customRequirements}` : ''}`,
  };

  const messages = [systemMessage, userMessage];
  
  // Log generation attempt for rate limiting (if userId provided)
  if (userId) {
    await logDocumentGeneration(userId, documentType);
  }

  // Generate with streaming enabled by default for real-time feedback
  const config = { ...DEFAULT_CONFIG, stream: true, ...options };
  
  return generateCompletion(messages, config);
}

/**
 * Create Server-Sent Events stream for real-time document generation
 */
export function createSSEStream(openaiStream: ReadableStream): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      const reader = openaiStream.getReader();
      const encoder = new TextEncoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            // Send completion event
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            break;
          }

          // Parse the chunk and extract content
          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                continue;
              }
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                
                if (content) {
                  const sseData = JSON.stringify({ 
                    type: 'content',
                    content,
                    timestamp: Date.now()
                  });
                  controller.enqueue(encoder.encode(`data: ${sseData}\n\n`));
                }
              } catch (parseError) {
                console.warn('Failed to parse SSE chunk:', parseError);
              }
            }
          }
        }
      } catch (error) {
        console.error('SSE Stream Error:', error);
        const errorData = JSON.stringify({ 
          type: 'error',
          error: error instanceof Error ? error.message : 'Stream error',
          timestamp: Date.now()
        });
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
      } finally {
        controller.close();
        reader.releaseLock();
      }
    }
  });
}

/**
 * Log document generation for rate limiting
 */
async function logDocumentGeneration(userId: string, documentType: string): Promise<void> {
  // This would integrate with your Supabase database to track usage
  // For now, we'll just log it
  console.log(`Document generation logged: User ${userId}, Type: ${documentType}, Timestamp: ${new Date().toISOString()}`);
  
  // TODO: Implement actual database logging
  // Example:
  // await supabase
  //   .from('document_generations')
  //   .insert([{
  //     user_id: userId,
  //     document_type: documentType,
  //     created_at: new Date().toISOString(),
  //   }]);
}

/**
 * Check rate limits for a user based on their subscription plan
 */
export async function checkRateLimit(userId: string, planType: 'starter' | 'pro' | 'enterprise'): Promise<RateLimitInfo> {
  // Rate limits per plan
  const rateLimits = {
    starter: 100, // 100 docs per month
    pro: -1,      // Unlimited
    enterprise: -1 // Unlimited
  };

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  
  // TODO: Implement actual rate limit checking with Supabase
  // For now, return a mock response
  const mockUsage = 0; // Get from database
  const limit = rateLimits[planType];
  
  return {
    remaining: limit === -1 ? -1 : Math.max(0, limit - mockUsage),
    resetTime: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1), // Next month
    planType,
  };
}

/**
 * Validate API key and model availability
 */
export async function validateOpenAI(): Promise<boolean> {
  try {
    await openai.models.list();
    return true;
  } catch (error) {
    console.error('OpenAI validation failed:', error);
    return false;
  }
}

// Export the OpenAI client for advanced usage
export { openai };
