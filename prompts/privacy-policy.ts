import { BasePromptTemplate } from './base.js';

export class PrivacyPolicyTemplate extends BasePromptTemplate {
  documentType = 'privacy-policy';

  protected buildBasePrompt(clientDetails: Record<string, any>, customRequirements?: string): string {
    const {
      businessName,
      abn,
      businessAddress,
      website,
      contactEmail,
      dataController,
      dataTypes,
      thirdPartyServices,
      internationalTransfers,
      state
    } = clientDetails;

    return `You are an expert Australian privacy law writer. Generate a comprehensive Privacy Policy for an Australian business that fully complies with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).

BUSINESS DETAILS:
- Business Name: ${businessName}
- ABN: ${abn}
- Address: ${this.formatAustralianAddress(businessAddress)}
- Website: ${website || '[Website URL]'}
- Contact Email: ${contactEmail || '[Contact Email]'}
- Data Controller: ${dataController || businessName}
- Data Types Collected: ${dataTypes || 'Personal and business information'}
- Third-Party Services: ${thirdPartyServices || 'Standard third-party integrations'}
- International Data Transfers: ${internationalTransfers || 'None specified'}
- State/Territory: ${state}

MANDATORY AUSTRALIAN PRIVACY LAW COMPLIANCE:
1. Privacy Act 1988 (Cth)
2. Australian Privacy Principles (APPs)
3. Notifiable Data Breaches (NDB) scheme
4. Telecommunications Consumer Protections Code
5. State-specific privacy legislation for ${state}

REQUIRED AUSTRALIAN PRIVACY PRINCIPLES (APPs) COVERAGE:
APP 1: Open and transparent management of personal information
APP 2: Anonymity and pseudonymity
APP 3: Collection of solicited personal information
APP 4: Dealing with unsolicited personal information
APP 5: Notification of the collection of personal information
APP 6: Use or disclosure of personal information
APP 7: Direct marketing
APP 8: Cross-border disclosure of personal information
APP 9: Adoption, use or disclosure of government related identifiers
APP 10: Quality of personal information
APP 11: Security of personal information
APP 12: Access to personal information
APP 13: Correction of personal information

REQUIRED SECTIONS TO INCLUDE:
1. Introduction and Scope
2. What Personal Information We Collect
3. How We Collect Personal Information
4. Why We Collect Personal Information
5. How We Use and Disclose Personal Information
6. Direct Marketing (APP 7 compliance)
7. Data Quality and Security (APPs 10 & 11)
8. Access and Correction Rights (APPs 12 & 13)
9. Cross-Border Data Transfers (APP 8)
10. Data Breach Notification
11. Cookies and Tracking Technologies
12. Third-Party Services and Links
13. Children's Privacy
14. Changes to Privacy Policy
15. Complaints and Contact Information
16. Office of the Australian Information Commissioner (OAIC) Rights

CRITICAL AUSTRALIAN PRIVACY REQUIREMENTS:
- Clear notice at or before collection (APP 5)
- Consent mechanisms compliant with APPs
- Individual access and correction rights
- Data breach notification procedures
- Cross-border transfer protections
- Direct marketing opt-out mechanisms
- Complaint handling procedures
- OAIC enforcement rights and complaint pathways

SPECIAL CONSIDERATIONS:
- Small business exemptions (if applicable)
- Health information requirements (if applicable)
- Employee privacy considerations
- Credit reporting provisions (if applicable)
- Telecommunications privacy (if applicable)

DOCUMENT TONE AND STYLE:
- Clear, plain English as required by APP 1
- Accessible language for general public
- Comprehensive but not overwhelming
- Use Australian spelling throughout
- Include practical examples where helpful

${customRequirements ? `ADDITIONAL REQUIREMENTS:\n${customRequirements}` : ''}

Generate a complete, professional Privacy Policy that provides transparency about data practices while ensuring full compliance with Australian privacy law.`;
  }

  validateClientDetails(clientDetails: Record<string, any>): string[] {
    const baseErrors = super.validateClientDetails(clientDetails);
    const errors = [...baseErrors];

    // Additional validation for Privacy Policy
    if (!clientDetails.contactEmail) {
      errors.push('Contact email is required for Privacy Policy');
    }

    if (!clientDetails.website) {
      errors.push('Website URL is strongly recommended for Privacy Policy');
    }

    return errors;
  }
}
