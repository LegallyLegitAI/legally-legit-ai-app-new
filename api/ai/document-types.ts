import { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getAvailableDocumentTypes,
  getDocumentsByCategory,
  getDocumentMetadata,
} from '../../prompts/index';

/**
 * Vercel Edge Function to get available document types and their metadata
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { type, category } = req.query;

    // If specific document type is requested
    if (type && typeof type === 'string') {
      const metadata = getDocumentMetadata(type);

      if (!metadata) {
        res.status(404).json({
          error: 'Document type not found',
          availableTypes: getAvailableDocumentTypes(),
        });
        return;
      }

      res.status(200).json({
        success: true,
        documentType: metadata,
      });
      return;
    }

    // Get all document types
    const documentTypes = getAvailableDocumentTypes();
    const documentsByCategory = getDocumentsByCategory();

    // Filter by category if requested
    if (category && typeof category === 'string') {
      const categoryDocuments = documentsByCategory[category];

      if (!categoryDocuments) {
        res.status(404).json({
          error: 'Category not found',
          availableCategories: Object.keys(documentsByCategory),
        });
        return;
      }

      res.status(200).json({
        success: true,
        category,
        documents: categoryDocuments,
        total: categoryDocuments.length,
      });
      return;
    }

    // Return all document types with full metadata
    res.status(200).json({
      success: true,
      documentTypes,
      documentsByCategory,
      total: documentTypes.length,
      categories: Object.keys(documentsByCategory),
      metadata: {
        supportedRegion: 'Australia',
        legalCompliance: [
          'Australian Consumer Law',
          'Privacy Act 1988',
          'Spam Act 2003',
          'Fair Trading Acts',
          'Competition and Consumer Act 2010',
        ],
        features: [
          'Real-time streaming generation',
          'Australian legal compliance',
          'Rate limiting by subscription plan',
          'Professional document templates',
          'Mandatory compliance clauses',
        ],
      },
    });
  } catch (error) {
    console.error('Document types API error:', error);
    res.status(500).json({
      error: 'Failed to retrieve document types',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Export configuration for Vercel
export const config = {
  runtime: 'nodejs18.x',
  regions: ['syd1'], // Australia region for better latency
};
