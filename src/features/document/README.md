# Document Generator Wizard

A comprehensive 4-step wizard component for generating legal documents with OpenAI integration, built specifically for Australian small business owners.

## Features

- **4-Step Wizard Interface**: Guided process from document selection to final download
- **JSON Schema-Driven Forms**: Dynamic form generation based on document type
- **OpenAI Integration**: Leverages existing `/api/ai/generate-document` endpoint
- **Real-time Preview**: ReactMarkdown rendering with syntax highlighting
- **PDF Download**: Client-side PDF generation using jsPDF and html2canvas
- **Database Storage**: Documents saved to Supabase `documents` table
- **Privacy Compliance**: Optional anonymized data storage for model improvement
- **Australian Legal Focus**: Tailored for Australian business requirements

## Components

### DocumentGeneratorWizard
The main wizard component that orchestrates the entire document generation flow.

### StepIndicator
Visual progress indicator showing the current step and completion status.

### Step Components
- **Step1**: Document type selection
- **Step2**: Business details form (schema-driven)
- **Step3**: Custom requirements and privacy consent
- **Step4**: Document preview, save, and download

## Document Types Supported

### Terms of Service
- Comprehensive terms and conditions
- Australian Consumer Law compliance
- Required fields: Business name, ABN, address, contact details, service description

### Privacy Policy
- Australian Privacy Act 1988 compliant
- Australian Privacy Principles (APPs) coverage
- Data collection and third-party service declarations
- Required fields: Business details, website, data collection types

### Service Agreement
- Professional service agreements
- Payment terms and delivery timelines
- Service type categorization
- Required fields: Business details, detailed service description

## JSON Schema Structure

Each document type has a corresponding JSON schema that defines:
- Required and optional fields
- Field types (string, email, select, checkbox arrays)
- Validation rules (patterns, min/max length)
- UI hints (descriptions, enumerated values)

## Privacy & Compliance

### Data Usage Consent
Users must consent to data usage for document generation (required).

### Anonymous Storage Option
Optional: Allow anonymized document storage for AI model improvement.
- Personal details are removed
- Used for training purposes only
- Fully compliant with privacy regulations

## Technical Implementation

### Form Management
- React Hook Form with Zod validation
- Dynamic form generation from JSON schemas
- Real-time validation and error handling

### Document Generation
- Calls existing `/api/ai/generate-document` endpoint
- Supports both streaming and non-streaming responses
- Error handling and retry logic

### PDF Generation
- Client-side PDF creation using jsPDF
- HTML to canvas conversion with html2canvas
- Multi-page support for long documents
- PDF metadata including title, author, creation date

### Database Integration
- Documents stored in Supabase `documents` table
- Includes metadata: user ID, generation timestamp, form data
- Status tracking (draft, published, etc.)

## Usage

```tsx
import { DocumentGeneratorWizard } from '@/features/document';

function MyPage() {
  return <DocumentGeneratorWizard />;
}
```

## File Structure

```
src/features/document/
├── components/
│   ├── DocumentGenerator.tsx       # Legacy wrapper
│   ├── DocumentGeneratorWizard.tsx # Main wizard component
│   └── StepIndicator.tsx          # Progress indicator
├── types/
│   ├── index.ts                   # Type exports
│   └── wizard.ts                  # Wizard-specific types and schemas
├── README.md                      # This file
└── index.ts                       # Feature exports
```

## Dependencies

- `react-hook-form`: Form management
- `@hookform/resolvers/zod`: Form validation
- `react-markdown`: Document preview rendering
- `react-syntax-highlighter`: Code highlighting in documents
- `jspdf`: PDF generation
- `html2canvas`: HTML to image conversion
- `framer-motion`: Smooth step transitions
- `lucide-react`: Icons

## Future Enhancements

1. **Additional Document Types**
   - Employment contracts
   - Website disclaimers
   - Non-disclosure agreements
   - Supplier agreements

2. **Advanced Features**
   - Document templates with placeholders
   - Collaborative editing
   - Document versioning
   - Email delivery integration

3. **Enhanced Privacy**
   - End-to-end encryption for sensitive documents
   - Advanced anonymization techniques
   - Audit trail for compliance

4. **Australian Legal Updates**
   - Automatic compliance updates
   - State-specific variations
   - Industry-specific templates

## API Integration

The wizard integrates with existing API endpoints:

- `GET /api/ai/document-types`: Retrieve available document types and metadata
- `POST /api/ai/generate-document`: Generate documents with OpenAI
- Supabase: Document storage and user management

## Accessibility

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Mobile-responsive design
- Progress indication for users with disabilities

## Testing

The wizard includes comprehensive testing for:
- Form validation and submission
- Document generation flow
- PDF creation functionality
- Error handling scenarios
- Accessibility compliance
