import { describe, it, expect } from 'vitest';
import { 
  getPromptTemplate, 
  validateClientDetailsForDocument,
  getAvailableDocumentTypes,
  DOCUMENT_METADATA 
} from './index';
import { TermsOfServiceTemplate } from './terms-of-service';
import { PrivacyPolicyTemplate } from './privacy-policy';
import { formatABN } from './base';

// Mock client details for testing
const mockAustralianBusiness = {
  businessName: 'Test Business Pty Ltd',
  abn: '12345678901',
  businessAddress: {
    streetAddress: '123 Collins Street',
    suburb: 'Melbourne',
    state: 'VIC',
    postcode: '3000'
  },
  state: 'VIC',
  contactEmail: 'test@testbusiness.com.au',
  website: 'https://testbusiness.com.au',
  serviceDescription: 'Digital consulting services'
};

describe('Prompt Templates - Australian Legal Compliance', () => {
  describe('Template Factory', () => {
    it('should return all available document types', () => {
      const types = getAvailableDocumentTypes();
      expect(types).toContain('terms-of-service');
      expect(types).toContain('privacy-policy');
      expect(types.length).toBeGreaterThan(0);
    });

    it('should return valid template instances', () => {
      const tosTemplate = getPromptTemplate('terms-of-service');
      const privacyTemplate = getPromptTemplate('privacy-policy');
      
      expect(tosTemplate).toBeInstanceOf(TermsOfServiceTemplate);
      expect(privacyTemplate).toBeInstanceOf(PrivacyPolicyTemplate);
    });

    it('should return null for invalid document types', () => {
      const invalidTemplate = getPromptTemplate('invalid-type');
      expect(invalidTemplate).toBeNull();
    });
  });

  describe('Australian Business Validation', () => {
    it('should validate required Australian business fields', () => {
      const result = validateClientDetailsForDocument('terms-of-service', mockAustralianBusiness);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid ABN format', () => {
      const invalidBusiness = { ...mockAustralianBusiness, abn: '123' };
      const result = validateClientDetailsForDocument('terms-of-service', invalidBusiness);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ABN must be 11 digits');
    });

    it('should reject invalid Australian state', () => {
      const invalidBusiness = { ...mockAustralianBusiness, state: 'INVALID' };
      const result = validateClientDetailsForDocument('terms-of-service', invalidBusiness);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('State must be a valid Australian state or territory');
    });

    it('should require essential business information', () => {
      const incompleteBusiness = {
        businessName: 'Test Business'
        // Missing ABN, address, state
      };
      const result = validateClientDetailsForDocument('terms-of-service', incompleteBusiness);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required field: abn');
      expect(result.errors).toContain('Missing required field: businessAddress');
      expect(result.errors).toContain('Missing required field: state');
    });
  });

  describe('Mandatory Compliance Clauses', () => {
    it('should include Spam Act 2003 footer in all templates', () => {
      const tosTemplate = getPromptTemplate('terms-of-service');
      const privacyTemplate = getPromptTemplate('privacy-policy');
      
      const tosPrompt = tosTemplate!.buildPrompt(mockAustralianBusiness);
      const privacyPrompt = privacyTemplate!.buildPrompt(mockAustralianBusiness);
      
      expect(tosPrompt).toContain('Australian Spam Act 2003');
      expect(privacyPrompt).toContain('Australian Spam Act 2003');
      expect(tosPrompt).toContain('support@legallyllegit.ai');
      expect(privacyPrompt).toContain('support@legallyllegit.ai');
    });

    it('should include Privacy Act 1988 notice in all templates', () => {
      const tosTemplate = getPromptTemplate('terms-of-service');
      const privacyTemplate = getPromptTemplate('privacy-policy');
      
      const tosPrompt = tosTemplate!.buildPrompt(mockAustralianBusiness);
      const privacyPrompt = privacyTemplate!.buildPrompt(mockAustralianBusiness);
      
      expect(tosPrompt).toContain('Australian Privacy Act 1988');
      expect(privacyPrompt).toContain('Australian Privacy Act 1988');
    });

    it('should include Australian Consumer Law disclaimer', () => {
      const tosTemplate = getPromptTemplate('terms-of-service');
      const tosPrompt = tosTemplate!.buildPrompt(mockAustralianBusiness);
      
      expect(tosPrompt).toContain('Australian Consumer Law Disclaimer');
      expect(tosPrompt).toContain('Australian Consumer Law protections');
    });

    it('should include professional indemnity notice', () => {
      const tosTemplate = getPromptTemplate('terms-of-service');
      const tosPrompt = tosTemplate!.buildPrompt(mockAustralianBusiness);
      
      expect(tosPrompt).toContain('Professional Standards');
      expect(tosPrompt).toContain('AI technology');
      expect(tosPrompt).toContain('qualified Australian legal practitioner');
    });

    it('should require Australian law compliance instructions', () => {
      const tosTemplate = getPromptTemplate('terms-of-service');
      const tosPrompt = tosTemplate!.buildPrompt(mockAustralianBusiness);
      
      expect(tosPrompt).toContain('MUST comply with Australian law');
      expect(tosPrompt).toContain('Australian spelling');
      expect(tosPrompt).toContain('DD/MM/YYYY');
      expect(tosPrompt).toContain('AUD');
    });
  });

  describe('Terms of Service Template', () => {
    it('should require service description and contact email', () => {
      const incompleteBusiness = { ...mockAustralianBusiness };
      delete incompleteBusiness.serviceDescription;
      delete incompleteBusiness.contactEmail;
      
      const result = validateClientDetailsForDocument('terms-of-service', incompleteBusiness);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Service description is required for Terms of Service');
      expect(result.errors).toContain('Contact email is required for Terms of Service');
    });

    it('should include Australian Consumer Law requirements', () => {
      const template = new TermsOfServiceTemplate();
      const prompt = template.buildPrompt(mockAustralianBusiness);
      
      expect(prompt).toContain('Australian Consumer Law');
      expect(prompt).toContain('Competition and Consumer Act 2010');
      expect(prompt).toContain('Consumer guarantees cannot be excluded');
      expect(prompt).toContain('ACCC');
    });

    it('should include state-specific requirements', () => {
      const template = new TermsOfServiceTemplate();
      const prompt = template.buildPrompt(mockAustralianBusiness);
      
      expect(prompt).toContain('Fair Trading Acts (state-specific for VIC)');
      expect(prompt).toContain('VIC jurisdiction');
    });
  });

  describe('Privacy Policy Template', () => {
    it('should require contact email and recommend website', () => {
      const incompleteBusiness = { ...mockAustralianBusiness };
      delete incompleteBusiness.contactEmail;
      delete incompleteBusiness.website;
      
      const result = validateClientDetailsForDocument('privacy-policy', incompleteBusiness);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Contact email is required for Privacy Policy');
      expect(result.errors).toContain('Website URL is strongly recommended for Privacy Policy');
    });

    it('should include all Australian Privacy Principles (APPs)', () => {
      const template = new PrivacyPolicyTemplate();
      const prompt = template.buildPrompt(mockAustralianBusiness);
      
      // Check for all 13 APPs
      for (let i = 1; i <= 13; i++) {
        expect(prompt).toContain(`APP ${i}:`);
      }
      
      expect(prompt).toContain('Notifiable Data Breaches (NDB) scheme');
      expect(prompt).toContain('Office of the Australian Information Commissioner (OAIC)');
    });
  });

  describe('ABN Formatting Utility', () => {
    it('should format ABN correctly', () => {
      const abn = '12345678901';
      const formatted = formatABN(abn);
      expect(formatted).toBe('12 345 678 901');
    });

    it('should handle ABN with existing spaces', () => {
      const abn = '12 345 678 901';
      const formatted = formatABN(abn);
      expect(formatted).toBe('12 345 678 901');
    });

    it('should throw error for invalid ABN length', () => {
      expect(() => formatABN('123')).toThrow('ABN must be 11 digits');
    });
  });

  describe('Document Metadata', () => {
    it('should provide complete metadata for all document types', () => {
      const types = getAvailableDocumentTypes();
      
      types.forEach(type => {
        const metadata = DOCUMENT_METADATA[type];
        expect(metadata).toBeDefined();
        expect(metadata.name).toBeTruthy();
        expect(metadata.description).toBeTruthy();
        expect(['legal', 'business', 'compliance']).toContain(metadata.category);
        expect(['basic', 'intermediate', 'advanced']).toContain(metadata.complexity);
        expect(metadata.requiredFields).toBeInstanceOf(Array);
        expect(metadata.requiredFields.length).toBeGreaterThan(0);
      });
    });

    it('should include essential Australian business fields in all templates', () => {
      Object.values(DOCUMENT_METADATA).forEach(metadata => {
        expect(metadata.requiredFields).toContain('businessName');
        expect(metadata.requiredFields).toContain('abn');
        expect(metadata.requiredFields).toContain('businessAddress');
        expect(metadata.requiredFields).toContain('state');
      });
    });
  });

  describe('Custom Requirements Integration', () => {
    it('should incorporate custom requirements into prompts', () => {
      const template = getPromptTemplate('terms-of-service');
      const customRequirements = 'Include specific industry regulations for financial services';
      const prompt = template!.buildPrompt(mockAustralianBusiness, customRequirements);
      
      expect(prompt).toContain('ADDITIONAL REQUIREMENTS:');
      expect(prompt).toContain(customRequirements);
    });

    it('should work without custom requirements', () => {
      const template = getPromptTemplate('terms-of-service');
      const prompt = template!.buildPrompt(mockAustralianBusiness);
      
      expect(prompt).not.toContain('ADDITIONAL REQUIREMENTS:');
      expect(prompt).toContain('Generate a complete, professional');
    });
  });
});
