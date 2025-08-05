import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Marketing = () => {
  return (
    <div className="mx-auto max-w-screen-lg p-4">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-prevent-600">Empower Your Legal Practice</h1>
        <p className="mt-2 text-lg text-legally-neutral-600">
          Transformative solutions for modern legal challenges.
        </p>
        <div className="mt-6">
          <Button variant="protect" size="lg" icon={<i className="fa fa-arrow-right" />} iconPosition="right">
            Get Started
          </Button>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card variant="prevent">
          <CardHeader>
            <CardTitle>Protect</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-legally-neutral-600">
              Our solutions ensure your data and client's interests are safeguarded.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="prevent" size="sm">Learn More</Button>
          </CardFooter>
        </Card>

        <Card variant="predict">
          <CardHeader>
            <CardTitle>Predict</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-legally-neutral-600">
              Leverage cutting-edge technology to anticipate legal trends.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="predict" size="sm">Learn More</Button>
          </CardFooter>
        </Card>

        <Card variant="protect">
          <CardHeader>
            <CardTitle>Prevent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-legally-neutral-600">
              Develop strategies to pre-emptively tackle potential legal issues.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="protect" size="sm">Learn More</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
};

export default Marketing;

