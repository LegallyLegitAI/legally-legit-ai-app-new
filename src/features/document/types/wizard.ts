export interface DocumentTypeMetadata {
  id: string;
  name: string;
  description: string;
  category: 'legal' | 'business' | 'compliance';
  complexity: 'basic' | 'intermediate' | 'advanced';
  estimatedTime: string;
  requiredFields: string[];
  schema: Record<string, any>; // JSON Schema for form generation
}

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

export interface GeneratedDocument {
  id: string;
  title: string;
  content: string;
  html?: string;
  documentType: string;
  metadata: {
    generatedAt: string;
    userId?: string;
    formData: Record<string, any>;
  };
}

export interface DocumentFormData {
  documentType: string;
  businessDetails: {
    businessName: string;
    abn: string;
    businessAddress: string;
    state: string;
    website?: string;
    contactEmail: string;
    phoneNumber?: string;
  };
  serviceDetails?: {
    serviceDescription: string;
    industryType?: string;
    targetAudience?: string;
  };
  customRequirements?: string;
  privacySettings?: {
    allowAnonymousStorage: boolean;
    dataUsageConsent: boolean;
  };
}

// JSON Schemas for different document types
export const DOCUMENT_SCHEMAS = {
  'terms-of-service': {
    type: 'object',
    required: ['businessName', 'abn', 'businessAddress', 'state', 'contactEmail', 'serviceDescription'],
    properties: {
      businessName: {
        type: 'string',
        title: 'Business Name',
        description: 'Your registered business name',
        minLength: 2,
        maxLength: 100
      },
      abn: {
        type: 'string',
        title: 'ABN',
        description: 'Australian Business Number (11 digits)',
        pattern: '^[0-9]{11}$'
      },
      businessAddress: {
        type: 'string',
        title: 'Business Address',
        description: 'Your business postal address',
        minLength: 10,
        maxLength: 200
      },
      state: {
        type: 'string',
        title: 'State/Territory',
        enum: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
        enumNames: [
          'New South Wales',
          'Victoria',
          'Queensland',
          'Western Australia',
          'South Australia',
          'Tasmania',
          'Australian Capital Territory',
          'Northern Territory'
        ]
      },
      contactEmail: {
        type: 'string',
        title: 'Contact Email',
        format: 'email',
        description: 'Business contact email address'
      },
      phoneNumber: {
        type: 'string',
        title: 'Phone Number',
        description: 'Business phone number (optional)',
        pattern: '^\\+?[0-9\\s\\-\\(\\)]{8,15}$'
      },
      website: {
        type: 'string',
        title: 'Website URL',
        format: 'uri',
        description: 'Your business website (optional)'
      },
      serviceDescription: {
        type: 'string',
        title: 'Service Description',
        description: 'Brief description of your services',
        minLength: 20,
        maxLength: 500
      },
      industryType: {
        type: 'string',
        title: 'Industry Type',
        enum: [
          'technology',
          'consulting',
          'retail',
          'healthcare',
          'finance',
          'education',
          'manufacturing',
          'hospitality',
          'construction',
          'other'
        ],
        enumNames: [
          'Technology & Software',
          'Professional Services & Consulting',
          'Retail & E-commerce',
          'Healthcare & Medical',
          'Finance & Insurance',
          'Education & Training',
          'Manufacturing',
          'Hospitality & Tourism',
          'Construction & Trades',
          'Other'
        ]
      }
    }
  },

  'privacy-policy': {
    type: 'object',
    required: ['businessName', 'abn', 'businessAddress', 'state', 'contactEmail', 'website'],
    properties: {
      businessName: {
        type: 'string',
        title: 'Business Name',
        description: 'Your registered business name',
        minLength: 2,
        maxLength: 100
      },
      abn: {
        type: 'string',
        title: 'ABN',
        description: 'Australian Business Number (11 digits)',
        pattern: '^[0-9]{11}$'
      },
      businessAddress: {
        type: 'string',
        title: 'Business Address',
        description: 'Your business postal address',
        minLength: 10,
        maxLength: 200
      },
      state: {
        type: 'string',
        title: 'State/Territory',
        enum: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
        enumNames: [
          'New South Wales',
          'Victoria',
          'Queensland',
          'Western Australia',
          'South Australia',
          'Tasmania',
          'Australian Capital Territory',
          'Northern Territory'
        ]
      },
      contactEmail: {
        type: 'string',
        title: 'Contact Email',
        format: 'email',
        description: 'Business contact email address'
      },
      website: {
        type: 'string',
        title: 'Website URL',
        format: 'uri',
        description: 'Your business website URL'
      },
      dataCollection: {
        type: 'array',
        title: 'Types of Data Collected',
        description: 'Select the types of personal information you collect',
        uniqueItems: true,
        items: {
          type: 'string',
          enum: [
            'personal_details',
            'contact_information',
            'financial_information',
            'cookies_tracking',
            'website_analytics',
            'marketing_preferences',
            'device_information',
            'location_data'
          ]
        },
        enumNames: [
          'Personal Details (name, age, etc.)',
          'Contact Information (email, phone)',
          'Financial Information (payment details)',
          'Cookies & Tracking Data',
          'Website Analytics Data',
          'Marketing Preferences',
          'Device Information',
          'Location Data'
        ]
      },
      thirdPartyServices: {
        type: 'array',
        title: 'Third-Party Services Used',
        description: 'Select third-party services you use that may collect data',
        uniqueItems: true,
        items: {
          type: 'string',
          enum: [
            'google_analytics',
            'facebook_pixel',
            'mailchimp',
            'stripe',
            'paypal',
            'intercom',
            'hubspot',
            'salesforce',
            'aws',
            'other'
          ]
        },
        enumNames: [
          'Google Analytics',
          'Facebook Pixel',
          'MailChimp',
          'Stripe',
          'PayPal',
          'Intercom',
          'HubSpot',
          'Salesforce',
          'Amazon Web Services',
          'Other Services'
        ]
      }
    }
  },

  'service-agreement': {
    type: 'object',
    required: ['businessName', 'abn', 'businessAddress', 'state', 'serviceDescription'],
    properties: {
      businessName: {
        type: 'string',
        title: 'Business Name',
        description: 'Your registered business name',
        minLength: 2,
        maxLength: 100
      },
      abn: {
        type: 'string',
        title: 'ABN',
        description: 'Australian Business Number (11 digits)',
        pattern: '^[0-9]{11}$'
      },
      businessAddress: {
        type: 'string',
        title: 'Business Address',
        description: 'Your business postal address',
        minLength: 10,
        maxLength: 200
      },
      state: {
        type: 'string',
        title: 'State/Territory',
        enum: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
        enumNames: [
          'New South Wales',
          'Victoria',
          'Queensland',
          'Western Australia',
          'South Australia',
          'Tasmania',
          'Australian Capital Territory',
          'Northern Territory'
        ]
      },
      contactEmail: {
        type: 'string',
        title: 'Contact Email',
        format: 'email',
        description: 'Business contact email address'
      },
      serviceDescription: {
        type: 'string',
        title: 'Service Description',
        description: 'Detailed description of services to be provided',
        minLength: 50,
        maxLength: 1000
      },
      serviceType: {
        type: 'string',
        title: 'Service Type',
        enum: [
          'consulting',
          'development',
          'design',
          'marketing',
          'maintenance',
          'training',
          'support',
          'other'
        ],
        enumNames: [
          'Consulting Services',
          'Software Development',
          'Design Services',
          'Marketing Services',
          'Maintenance Services',
          'Training Services',
          'Support Services',
          'Other Services'
        ]
      },
      paymentTerms: {
        type: 'string',
        title: 'Payment Terms',
        enum: ['net_7', 'net_14', 'net_30', 'net_60', 'upfront', 'milestone'],
        enumNames: [
          'Net 7 days',
          'Net 14 days',
          'Net 30 days',
          'Net 60 days',
          'Payment upfront',
          'Milestone-based payments'
        ]
      },
      deliveryTimeline: {
        type: 'string',
        title: 'Typical Delivery Timeline',
        description: 'Standard timeframe for service delivery'
      }
    }
  }
};

export const PRIVACY_CONSENT_SCHEMA = {
  type: 'object',
  required: ['dataUsageConsent'],
  properties: {
    allowAnonymousStorage: {
      type: 'boolean',
      title: 'Allow Anonymous Document Storage',
      description: 'Help us improve our AI by allowing anonymous storage of your generated documents for training purposes. Your personal details will be removed.',
      default: false
    },
    dataUsageConsent: {
      type: 'boolean',
      title: 'Privacy & Terms Consent',
      description: 'I agree to the privacy policy and understand how my data will be used for document generation.',
      const: true
    }
  }
};
