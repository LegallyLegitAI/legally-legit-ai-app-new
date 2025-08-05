import { ComplianceSection } from '../types';

// Comprehensive compliance survey for Australian small businesses
export const complianceSurvey: ComplianceSection[] = [
  {
    title: 'Data Privacy & Protection',
    questions: [
      {
        id: 'privacy-1',
        text: 'Do you have a written privacy policy that complies with the Australian Privacy Principles (APPs)?',
        section: 'privacy',
      },
      {
        id: 'privacy-2',
        text: 'Do you obtain explicit consent before collecting personal information from customers?',
        section: 'privacy',
      },
      {
        id: 'privacy-3',
        text: 'Do you have procedures in place to handle data breach notifications within 72 hours?',
        section: 'privacy',
      },
      {
        id: 'privacy-4',
        text: 'Are customer data access and deletion requests handled within required timeframes (30 days)?',
        section: 'privacy',
      },
    ],
  },
  {
    title: 'Employment & Workplace Safety',
    questions: [
      {
        id: 'employment-1',
        text: 'Do all employees have written employment contracts that comply with the Fair Work Act?',
        section: 'employment',
      },
      {
        id: 'employment-2',
        text: 'Are you up to date with minimum wage rates and penalty rates for your industry?',
        section: 'employment',
      },
      {
        id: 'employment-3',
        text: 'Do you have current workers\' compensation insurance coverage?',
        section: 'employment',
      },
      {
        id: 'employment-4',
        text: 'Have you conducted workplace health and safety risk assessments in the last 12 months?',
        section: 'employment',
      },
    ],
  },
  {
    title: 'Business Registration & Licensing',
    questions: [
      {
        id: 'registration-1',
        text: 'Is your Australian Business Number (ABN) current and valid?',
        section: 'registration',
      },
      {
        id: 'registration-2',
        text: 'Are all required business licenses and permits current for your industry?',
        section: 'registration',
      },
      {
        id: 'registration-3',
        text: 'Is your business name registered with ASIC (if applicable)?',
        section: 'registration',
      },
      {
        id: 'registration-4',
        text: 'Do you have adequate public liability insurance for your business activities?',
        section: 'registration',
      },
    ],
  },
  {
    title: 'Financial & Tax Compliance',
    questions: [
      {
        id: 'financial-1',
        text: 'Are you registered for GST (if annual turnover exceeds $75,000)?',
        section: 'financial',
      },
      {
        id: 'financial-2',
        text: 'Do you lodge BAS (Business Activity Statements) on time each quarter?',
        section: 'financial',
      },
      {
        id: 'financial-3',
        text: 'Are payroll taxes being calculated and paid correctly (if applicable)?',
        section: 'financial',
      },
      {
        id: 'financial-4',
        text: 'Do you keep accurate financial records as required by the Corporations Act?',
        section: 'financial',
      },
    ],
  },
  {
    title: 'Consumer Protection & Contract Law',
    questions: [
      {
        id: 'consumer-1',
        text: 'Do your terms and conditions comply with Australian Consumer Law?',
        section: 'consumer',
      },
      {
        id: 'consumer-2',
        text: 'Are your refund and warranty policies clearly communicated to customers?',
        section: 'consumer',
      },
      {
        id: 'consumer-3',
        text: 'Do you have written contracts for all major business relationships (suppliers, contractors)?',
        section: 'consumer',
      },
      {
        id: 'consumer-4',
        text: 'Are your advertising and marketing practices compliant with competition and consumer law?',
        section: 'consumer',
      },
    ],
  },
];

// Risk scoring weights for each section
export const sectionWeights = {
  privacy: 25, // High importance for data protection
  employment: 20, // Critical for businesses with employees
  registration: 20, // Foundation legal requirements
  financial: 20, // Tax compliance is mandatory
  consumer: 15, // Important for customer-facing businesses
};

// Recommendations based on risk areas
export const riskRecommendations = {
  privacy: [
    'Update your privacy policy to comply with Australian Privacy Principles',
    'Implement data breach response procedures',
    'Set up customer data access request workflows',
    'Review data collection and consent processes',
  ],
  employment: [
    'Review employment contracts with legal counsel',
    'Update wage rates to current Fair Work standards',
    'Arrange workers\' compensation insurance',
    'Conduct workplace safety risk assessment',
  ],
  registration: [
    'Renew ABN registration with ATO',
    'Check industry-specific licensing requirements',
    'Register business name with ASIC',
    'Review public liability insurance coverage',
  ],
  financial: [
    'Register for GST if turnover threshold reached',
    'Set up quarterly BAS lodgement system',
    'Review payroll tax obligations',
    'Implement proper bookkeeping systems',
  ],
  consumer: [
    'Update terms and conditions for Australian Consumer Law',
    'Clarify refund and warranty policies',
    'Draft comprehensive supplier/contractor agreements',
    'Review marketing materials for compliance',
  ],
};
