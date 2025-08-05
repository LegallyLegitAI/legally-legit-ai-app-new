import { useState } from 'react';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Download, Save, FileText, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Alert } from '../../../shared/components/ui/Alert';
import { Button } from '../../../shared/components/ui/Button';
import { Card } from '../../../shared/components/ui/Card';
import { Progress } from '../../../shared/components/ui/Progress';
import { Textarea } from '../../../shared/components/ui/Textarea';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../shared/lib/supabase';
import { DOCUMENT_SCHEMAS, PRIVACY_CONSENT_SCHEMA } from '../types/wizard';
import type { DocumentFormData, WizardStep, GeneratedDocument } from '../types/wizard';

const STEPS: WizardStep[] = [
  { id: 1, title: 'Select Document', description: 'Choose the legal document you need', isComplete: false, isActive: true },
  { id: 2, title: 'Answer Questions', description: 'Provide your business details', isComplete: false, isActive: false },
  { id: 3, title: 'Preview & Generate', description: 'Review and generate your document', isComplete: false, isActive: false },
  { id: 4, title: 'Save & Download', description: 'Save your document and download as PDF', isComplete: false, isActive: false },
];

const DocumentGeneratorWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<WizardStep[]>(STEPS);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const methods = useForm<DocumentFormData>({
    resolver: zodResolver(
      z.object({
        documentType: z.string().nonempty('Please select a document type'),
        businessDetails: z.any(),
        serviceDetails: z.any(),
        customRequirements: z.string().optional(),
        privacySettings: z.any(),
      })
    ),
    defaultValues: {
      documentType: '',
      customRequirements: '',
    },
  });

  const { watch, handleSubmit, trigger, getValues } = methods;
  const documentType = watch('documentType');

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (!isStepValid) return;

    if (currentStep < steps.length) {
      const newSteps = steps.map((step) =>
        step.id === currentStep ? { ...step, isComplete: true, isActive: false } : step
      );
      newSteps[currentStep].isActive = true;
      setSteps(newSteps);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateDocument = async (data: DocumentFormData) => {
    setIsLoading(true);
    setError(null);
    setGeneratedDocument(null);

    try {
      const response = await fetch('/api/ai/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: data.documentType,
          clientDetails: { ...data.businessDetails, ...data.serviceDetails },
          customRequirements: data.customRequirements,
          userId: user?.id,
          streaming: false, // For simplicity in this wizard
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate document');
      }

      const result = await response.json();
        setGeneratedDocument({
        id: `doc_${Date.now()}`,
        title: `Generated Document`,
        content: result.document,
        documentType: data.documentType,
        metadata: {
          generatedAt: new Date().toISOString(),
          userId: user?.id,
          formData: data,
        },
      });
      handleNext(); // Move to the final step
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!generatedDocument || !user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('documents').insert([
        {
          user_id: user.id,
          title: generatedDocument.title,
          content: generatedDocument.content,
          document_type: generatedDocument.documentType,
          metadata: generatedDocument.metadata,
          status: 'draft',
        },
      ]);

      if (error) throw error;
      alert('Document saved successfully!');
    } catch (err: any) {
      setError('Failed to save document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!generatedDocument) return;

    try {
      setIsLoading(true);
      
      const input = document.getElementById('document-preview');
      if (!input) return;

      // Generate canvas from the document preview
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // If content is longer than one page, split it
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      // Add metadata to the PDF
      pdf.setProperties({
        title: generatedDocument.title,
        subject: `${generatedDocument.documentType} generated by Legally Legit AI`,
        author: 'Legally Legit AI',
        creator: 'Legally Legit AI',
      });
      
      pdf.save(`${generatedDocument.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    } catch (error) {
      console.error('PDF download error:', error);
      setError('Failed to download PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-4">Document Generator Wizard</h1>
        <Progress value={(currentStep / steps.length) * 100} className="mb-8" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && <Step1 />}
            {currentStep === 2 && <Step2 documentType={documentType} />}
            {currentStep === 3 && (
              <Step3 onGenerate={handleGenerateDocument} isLoading={isLoading} document={generatedDocument} />
            )}
            {currentStep === 4 && (
              <Step4
                document={generatedDocument}
                onSave={handleSaveDocument}
                onDownload={handleDownloadPdf}
                isLoading={isLoading}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {error && <Alert variant="destructive" title="Error">{error}</Alert>}

        <div className="flex justify-between mt-8">
          <Button onClick={handleBack} disabled={currentStep === 1 || isLoading} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          {currentStep < 3 && (
            <Button onClick={handleNext} disabled={isLoading}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {currentStep === 3 && (
            <Button onClick={handleSubmit(handleGenerateDocument)} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Document'} <FileText className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </FormProvider>
  );
};

const Step1: React.FC = () => {
  const { setValue, watch } = useFormContext<DocumentFormData>();
  const selectedType = watch('documentType');

  const documentTypes = [
    {
      id: 'terms-of-service',
      name: 'Terms of Service',
      description: 'Comprehensive terms and conditions for your Australian business',
      category: 'legal',
    },
    {
      id: 'privacy-policy',
      name: 'Privacy Policy',
      description: 'Australian Privacy Act compliant privacy policy with APPs coverage',
      category: 'compliance',
    },
    {
      id: 'service-agreement',
      name: 'Service Agreement',
      description: 'Professional service agreement for Australian businesses',
      category: 'business',
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Select a Document Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map((doc) => (
          <div
            key={doc.id}
            className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-all ${
              selectedType === doc.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setValue('documentType', doc.id, { shouldValidate: true })}
          >
            <h3 className="font-bold text-lg">{doc.name}</h3>
            <p className="text-sm text-gray-600">{doc.description}</p>
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 rounded">
              {doc.category}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

const Step2: React.FC<{ documentType: string }> = ({ documentType }) => {
  const schema = DOCUMENT_SCHEMAS[documentType as keyof typeof DOCUMENT_SCHEMAS];
  if (!schema) return <p>Please select a document type first.</p>;

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-4">Your Business Details</h2>
      <form className="space-y-4">
        {Object.entries(schema.properties).map(([key, prop]: [string, any]) => (
          <FormInput key={key} name={`businessDetails.${key}`} prop={prop} />
        ))}
      </form>
    </Card>
  );
};

const Step3: React.FC<{ onGenerate: (data: any) => void; isLoading: boolean; document: GeneratedDocument | null }> = ({ onGenerate, isLoading, document }) => {
  const { control } = useFormContext<DocumentFormData>();

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-4">Preview & Generate</h2>
      <div className="mb-4">
        <h3 className="font-bold mb-2">Custom Requirements (Optional)</h3>
        <Controller
          name="customRequirements"
          control={control}
          render={({ field }) => <Textarea {...field} placeholder="e.g., specific clauses to include or exclude" />}
        />
      </div>
      <PrivacyConsentForm />
      {document && (
        <div id="document-preview" className="mt-6 p-4 border rounded-md bg-gray-50">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter style={darcula} language={match[1]} PreTag="div" {...props}>
                    {String(children).replace(/\\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {document.content}
          </ReactMarkdown>
        </div>
      )}
    </Card>
  );
};

const Step4: React.FC<{ document: GeneratedDocument | null; onSave: () => void; onDownload: () => void; isLoading: boolean }> = ({ document, onSave, onDownload, isLoading }) => {
  if (!document) return <p>No document generated yet.</p>;

  return (
    <Card>
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Document Generated Successfully!</h2>
        <p className="mb-6">Save your document to your dashboard or download it as a PDF.</p>
      </div>
      <div id="document-preview" className="mb-6 p-4 border rounded-md bg-gray-50 max-h-[500px] overflow-y-auto">
        <ReactMarkdown>{document.content}</ReactMarkdown>
      </div>
      <div className="flex justify-center gap-4">
        <Button onClick={onSave} disabled={isLoading}><Save className="mr-2 h-4 w-4" /> Save to Dashboard</Button>
        <Button onClick={onDownload} variant="secondary"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
      </div>
    </Card>
  );
};

const FormInput: React.FC<{ name: string; prop: any }> = ({ name, prop }) => {
  const { control } = useFormContext<DocumentFormData>();

  const renderField = (field: any, fieldState: any) => {
    // Handle select/enum fields
    if (prop.enum) {
      return (
        <select
          {...field}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select an option...</option>
          {prop.enum.map((option: string, index: number) => (
            <option key={option} value={option}>
              {prop.enumNames ? prop.enumNames[index] : option}
            </option>
          ))}
        </select>
      );
    }

    // Handle textarea fields
    if (prop.type === 'string' && (prop.maxLength > 100 || name.includes('description'))) {
      return (
        <textarea
          {...field}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      );
    }

    // Handle array fields (checkboxes)
    if (prop.type === 'array') {
      const currentValue = field.value || [];
      return (
        <div className="mt-2 space-y-2">
          {prop.items.enum.map((option: string, index: number) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={currentValue.includes(option)}
                onChange={(e) => {
                  const newValue = e.target.checked
                    ? [...currentValue, option]
                    : currentValue.filter((item: string) => item !== option);
                  field.onChange(newValue);
                }}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {prop.enumNames ? prop.enumNames[index] : option}
              </span>
            </label>
          ))}
        </div>
      );
    }

    // Default input field
    return (
      <input
        {...field}
        type={prop.format === 'email' ? 'email' : prop.format === 'uri' ? 'url' : 'text'}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder={prop.description}
      />
    );
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{prop.title}</label>
      <Controller
        name={name as any}
        control={control}
        render={({ field, fieldState }) => (
          <>
            {renderField(field, fieldState)}
            {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
          </>
        )}
      />
      {prop.description && <p className="text-sm text-gray-500 mt-1">{prop.description}</p>}
    </div>
  );
};

const PrivacyConsentForm: React.FC = () => {
  const { control } = useFormContext<DocumentFormData>();

  return (
    <div className="mt-6 p-4 border rounded-md bg-gray-100">
        <h3 className="font-bold mb-2">Privacy and Consent</h3>
        {Object.entries(PRIVACY_CONSENT_SCHEMA.properties).map(([key, prop]: [string, any]) => (
            <div key={key} className="flex items-start mb-2">
                 <Controller
                    name={`privacySettings.${key}` as any}
                    control={control}
                    render={({ field }) => (
                        <input type="checkbox" {...field} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    )}
                    />
                <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">{prop.title}</label>
                    <p className="text-gray-500">{prop.description}</p>
                </div>
            </div>
        ))}
    </div>
  );
};

export default DocumentGeneratorWizard;

