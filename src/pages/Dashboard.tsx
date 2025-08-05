import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const Dashboard = () => {
  return (
    <div className="mx-auto max-w-screen-lg p-4">
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card variant="predict">
          <CardHeader>
            <CardTitle>Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-legally-neutral-600">
              View and manage your active legal cases with ease.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="predict" size="sm">View Cases</Button>
          </CardFooter>
        </Card>

        <Card variant="protect">
          <CardHeader>
            <CardTitle>Pending Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-legally-neutral-600">
              Keep track of documents that require your attention.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="protect" size="sm">View Documents</Button>
          </CardFooter>
        </Card>

        <Card variant="prevent">
          <CardHeader>
            <CardTitle>Scheduling</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-legally-neutral-600">
              Schedule and manage your meetings and deadlines.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="prevent" size="sm">Manage Schedule</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;

