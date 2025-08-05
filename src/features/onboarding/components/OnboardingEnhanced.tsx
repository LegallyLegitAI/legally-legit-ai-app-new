import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Progress, Alert } from '@/shared/components';

const OnboardingEnhanced = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card variant="prevent" padding="lg">
            <CardHeader>
              <CardTitle>Welcome to Legally Legit AI</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="info" title="Getting Started" icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }>
                Let's set up your account in just a few simple steps. This will only take a couple of minutes.
              </Alert>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card variant="predict" padding="lg">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
              />
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card variant="protect" padding="lg">
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Enter your company name"
              />
              <Input
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Enter your role"
              />
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>All Set!</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="success" title="Setup Complete" icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }>
                Your account has been successfully set up. You can now start using Legally Legit AI to manage your legal practice.
              </Alert>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-prevent-600 mb-4">Account Setup</h1>
        <Progress
          value={progress}
          variant="prevent"
          size="md"
          showLabel
        />
        <p className="text-sm text-legally-neutral-600 mt-2">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      <div className="mb-8">
        {renderStepContent()}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        {currentStep < totalSteps ? (
          <Button
            variant="prevent"
            onClick={nextStep}
          >
            Next Step
          </Button>
        ) : (
          <Button
            variant="predict"
            onClick={() => {
              // Handle completion
              console.log('Onboarding completed!', formData);
            }}
          >
            Get Started
          </Button>
        )}
      </div>
    </div>
  );
};

export { OnboardingEnhanced };

