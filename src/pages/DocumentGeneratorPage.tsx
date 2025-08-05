import React from 'react';
import { DocumentGeneratorWizard } from '../features/document';
import { AppShell } from '../shared/components/layout/AppShell';

const DocumentGeneratorPage: React.FC = () => {
  return (
    <AppShell>
      <div className="min-h-screen bg-gray-50 py-8">
        <DocumentGeneratorWizard />
      </div>
    </AppShell>
  );
};

export default DocumentGeneratorPage;
