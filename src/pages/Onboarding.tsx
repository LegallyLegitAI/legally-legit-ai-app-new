import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const Onboarding = () => {
  return (
    <div className="mx-auto max-w-screen-lg p-4">
      <section>
        <Card variant="protect">
          <CardHeader>
            <CardTitle>Welcome to Legally Legit AI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-legally-neutral-600">
              Let's get you set up with a few simple steps.
            </p>
          </CardContent>
          <CardFooter className="flex space-x-4">
            <Button variant="protect" size="sm">Next Step</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
};

export default Onboarding;

