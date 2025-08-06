import { BasePromptTemplate } from './base';

export class TermsOfServiceTemplate extends BasePromptTemplate {
  documentType = 'terms-of-service';

  protected buildBasePrompt(
    clientDetails: Record<string, unknown>,
    customRequirements?: string
  ): string {
    const {
      businessName,
      abn,
      businessAddress,
      website,
      contactEmail,
      serviceDescription,
      pricingModel,
      refundPolicy,
      state,
    } = clientDetails;

    return `You are an expert Australian legal document writer. Generate comprehensive Terms of Service for an Australian business that complies with all relevant Australian consumer protection laws.

BUSINESS DETAILS:
- Business Name: ${businessName}
- ABN: ${abn}
- Address: ${this.formatAustralianAddress(businessAddress)}
- Website: ${website || '[Website URL]'}
- Contact Email: ${contactEmail || '[Contact Email]'}
- Services: ${serviceDescription || 'Digital services'}
- Pricing: ${pricingModel || 'Standard pricing applies'}
- Refund Policy: ${refundPolicy || 'Standard refund policy'}
- State/Territory: ${state}

MANDATORY AUSTRALIAN LAW COMPLIANCE:
1. Australian Consumer Law (Competition and Consumer Act 2010)
2. Privacy Act 1988
3. Spam Act 2003
4. Electronic Transactions Act 1999
5. Fair Trading Acts (state-specific for ${state})

REQUIRED SECTIONS TO INCLUDE:
1. Introduction and Acceptance
2. Description of Services
3. User Accounts and Registration
4. Payment Terms and Pricing
5. Refund and Cancellation Policy (ACL compliant)
6. Intellectual Property Rights
7. User Conduct and Prohibited Activities
8. Limitation of Liability (within ACL limits)
9. Consumer Guarantees (Australian Consumer Law)
10. Privacy and Data Protection
11. Third-Party Services and Links
12. Termination and Suspension
13. Dispute Resolution (including access to ACCC)
14. Governing Law (Australian law, ${state} jurisdiction)
15. Changes to Terms
16. Contact Information

CRITICAL AUSTRALIAN LAW REQUIREMENTS:
- Consumer guarantees cannot be excluded or limited
- Unfair contract terms provisions must be considered
- Cooling-off periods where applicable
- Clear dispute resolution pathways
- ACCC enforcement rights
- State-specific consumer protection laws for ${state}

DOCUMENT TONE AND STYLE:
- Professional but accessible language
- Clear, plain English as required by Australian consumer law
- Avoid overly complex legal jargon
- Include helpful explanations of key terms
- Use Australian spelling throughout (e.g., "favour", "colour", "organisation")

${customRequirements ? `ADDITIONAL REQUIREMENTS:\n${customRequirements}` : ''}

Generate a complete, professional Terms of Service document that provides strong legal protection while remaining fair and compliant with Australian consumer protection laws.`;
  }

  validateClientDetails(clientDetails: Record<string, unknown>): string[] {
    const baseErrors = super.validateClientDetails(clientDetails);
    const errors = [...baseErrors];

    // Additional validation for Terms of Service
    if (!clientDetails.serviceDescription) {
      errors.push('Service description is required for Terms of Service');
    }

    if (!clientDetails.contactEmail) {
      errors.push('Contact email is required for Terms of Service');
    }

    return errors;
  }
}
