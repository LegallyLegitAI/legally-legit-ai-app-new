import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import type { WizardStep } from '../types/wizard';

interface StepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step.isComplete
                    ? 'bg-green-500 border-green-500 text-white'
                    : step.isActive || currentStep === step.id
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
              >
                {step.isComplete ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <div className="ml-3 hidden sm:block">
                <p
                  className={`text-sm font-medium ${
                    step.isActive || currentStep === step.id
                      ? 'text-blue-600'
                      : step.isComplete
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  steps[index + 1].isComplete || currentStep > step.id
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Mobile view - simplified */}
      <div className="sm:hidden mt-4">
        <div className="flex items-center justify-center">
          <span className="text-sm text-gray-600">
            Step {currentStep} of {steps.length}: {steps.find(s => s.id === currentStep)?.title}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
