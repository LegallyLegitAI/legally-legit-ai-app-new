import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const Settings = () => {
  return (
    <div className="mx-auto max-w-screen-lg p-4">
      <section className="space-y-8">
        <Card variant="predict">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Email" variant="default" defaultValue="user@example.com" />
            <Input label="Username" variant="default" defaultValue="user123" />
          </CardContent>
          <CardFooter>
            <Button variant="predict" size="sm">Save Changes</Button>
          </CardFooter>
        </Card>

        <Card variant="prevent">
          <CardHeader>
            <CardTitle>Password Change</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="New Password" variant="default" type="password" />
            <Input label="Confirm Password" variant="default" type="password" />
          </CardContent>
          <CardFooter>
            <Button variant="prevent" size="sm">Change Password</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
};

export default Settings;

