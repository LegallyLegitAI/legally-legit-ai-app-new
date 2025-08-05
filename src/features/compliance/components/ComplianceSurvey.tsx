import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { complianceSurvey, sectionWeights, riskRecommendations } from '../data/surveyData';
import { useAuth } from '@/features/auth';
import { useCompliance } from '../hooks/useCompliance';
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter, Progress, Alert } from '@/shared/components';

const ComplianceSurvey: React.FC = () => {
  const { user } = useAuth();
  const { saveAssessment } = useCompliance(user?.id || '');
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const { control, handleSubmit, getValues } = useForm();

  const onSubmit = (data: any) => {
    if (currentStep < complianceSurvey.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step, calculate score and save
      const answers = getValues();
      let totalScore = 0;
      const recommendations: string[] = [];

      complianceSurvey.forEach((section, sectionIndex) => {
        let sectionScore = 0;
        section.questions.forEach((question, questionIndex) => {
          if (answers[question.id] === 'yes') {
            sectionScore += 1;
          } else {
            recommendations.push(riskRecommendations[section.questions[0].section as keyof typeof riskRecommendations][questionIndex]);
          }
        });
        totalScore += (sectionScore / section.questions.length) * (sectionWeights[section.questions[0].section as keyof typeof sectionWeights] || 0);
      });

      saveAssessment({
        user_id: user?.id,
        assessment_type: 'general_risk',
        score: Math.round(totalScore),
        recommendations: { items: recommendations },
        status: 'completed',
      });
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return (
      <Alert variant="success">
        <p>Thank you for completing the survey! Your compliance score has been updated.</p>
      </Alert>
    );
  }

  const currentSection = complianceSurvey[currentStep];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{currentSection.title}</CardTitle>
        <Progress value={(currentStep / complianceSurvey.length) * 100} />
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          {currentSection.questions.map((question) => (
            <div key={question.id} className="my-4">
              <label className="block text-sm font-medium text-gray-700">{question.text}</label>
              <Controller
                name={question.id}
                control={control}
                defaultValue="no"
                render={({ field }) => (
                  <div className="flex items-center space-x-4">
                    <label>
                      <input type="radio" {...field} value="yes" /> Yes
                    </label>
                    <label>
                      <input type="radio" {...field} value="no" /> No
                    </label>
                  </div>
                )}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            {currentStep > 0 && (
              <Button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
                Previous
              </Button>
            )}
            <Button type="submit">
              {currentStep < complianceSurvey.length - 1 ? 'Next' : 'Finish'}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ComplianceSurvey;
