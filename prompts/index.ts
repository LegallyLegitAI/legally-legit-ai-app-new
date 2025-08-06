import type { PromptTemplate } from './base';
import { TermsOfServiceTemplate } from './terms-of-service';
import { PrivacyPolicyTemplate } from './privacy-policy';

/**
 * Registry of all available prompt templates
 */
const TEMPLATE_REGISTRY = {
  'terms-of-service': TermsOfServiceTemplate,
  'privacy-policy': PrivacyPolicyTemplate,
  // Add more templates here as they're implemented
  'website-disclaimer': TermsOfServiceTemplate, // Alias for now
  'service-agreement': TermsOfServiceTemplate, // Alias for now
} as const;

export type DocumentType = keyof typeof TEMPLATE_REGISTRY;

/**
 * Get available document types
 */
export function getAvailableDocumentTypes(): DocumentType[] {
  return Object.keys(TEMPLATE_REGISTRY) as DocumentType[];
}

/**
 * Get a prompt template instance for the specified document type
 */
export function getPromptTemplate(documentType: string): PromptTemplate | null {
  const TemplateClass = TEMPLATE_REGISTRY[documentType as DocumentType];

  if (!TemplateClass) {
    console.warn(`Unknown document type: ${documentType}`);
    return null;
  }

  return new TemplateClass();
}

/**
 * Validate client details for a specific document type
 */
export function validateClientDetailsForDocument(
  documentType: string,
  clientDetails: Record<string, unknown>
): { isValid: boolean; errors: string[] } {
  const template = getPromptTemplate(documentType);

  if (!template) {
    return {
      isValid: false,
      errors: [`Unsupported document type: ${documentType}`],
    };
  }

  const errors = template.validateClientDetails(clientDetails);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get document type metadata for UI display
 */
export interface DocumentTypeMetadata {
  id: DocumentType;
  name: string;
  description: string;
  category: 'legal' | 'business' | 'compliance';
  complexity: 'basic' | 'intermediate' | 'advanced';
  estimatedTime: string;
  requiredFields: string[];
}

export const DOCUMENT_METADATA: Record<DocumentType, DocumentTypeMetadata> = {
  'terms-of-service': {
    id: 'terms-of-service',
    name: 'Terms of Service',
    description: 'Comprehensive terms and conditions for your Australian business',
    category: 'legal',
    complexity: 'intermediate',
    estimatedTime: '2-3 minutes',
    requiredFields: [
      'businessName',
      'abn',
      'businessAddress',
      'state',
      'serviceDescription',
      'contactEmail',
    ],
  },
  'privacy-policy': {
    id: 'privacy-policy',
    name: 'Privacy Policy',
    description: 'Australian Privacy Act compliant privacy policy with APPs coverage',
    category: 'compliance',
    complexity: 'intermediate',
    estimatedTime: '2-3 minutes',
    requiredFields: ['businessName', 'abn', 'businessAddress', 'state', 'contactEmail', 'website'],
  },
  'website-disclaimer': {
    id: 'website-disclaimer',
    name: 'Website Disclaimer',
    description: 'Legal disclaimer for your Australian business website',
    category: 'legal',
    complexity: 'basic',
    estimatedTime: '1-2 minutes',
    requiredFields: ['businessName', 'abn', 'businessAddress', 'state'],
  },
  'service-agreement': {
    id: 'service-agreement',
    name: 'Service Agreement',
    description: 'Professional service agreement for Australian businesses',
    category: 'business',
    complexity: 'advanced',
    estimatedTime: '3-5 minutes',
    requiredFields: ['businessName', 'abn', 'businessAddress', 'state', 'serviceDescription'],
  },
};

/**
 * Get metadata for a specific document type
 */
export function getDocumentMetadata(documentType: string): DocumentTypeMetadata | null {
  return DOCUMENT_METADATA[documentType as DocumentType] || null;
}

/**
 * Get all document metadata grouped by category
 */
export function getDocumentsByCategory(): Record<string, DocumentTypeMetadata[]> {
  const categories: Record<string, DocumentTypeMetadata[]> = {};

  Object.values(DOCUMENT_METADATA).forEach((metadata) => {
    if (!categories[metadata.category]) {
      categories[metadata.category] = [];
    }
    categories[metadata.category].push(metadata);
  });

  return categories;
}

// Re-export base types and classes
export type { PromptTemplate } from './base';
export { BasePromptTemplate, getCurrentAustralianDate, formatABN } from './base';
