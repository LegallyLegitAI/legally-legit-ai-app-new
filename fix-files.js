const fs = require('fs');

const adminContent = `import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const Admin = () => {
  return (
    <div className="mx-auto max-w-screen-lg p-4">
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card variant="protect">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-legally-neutral-600">
              Manage permissions and user settings directly from the dashboard.
            </p>
          </CardContent>
          <CardFooter className="flex space-x-4">
            <Button variant="protect" size="sm">Manage Users</Button>
          </CardFooter>
        </Card>

        <Card variant="predict">
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-legally-neutral-600">
              Gain insights into your platform's performance and user activity.
            </p>
          </CardContent>
          <CardFooter className="flex space-x-4">
            <Button variant="predict" size="sm">View Analytics</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
};

export default Admin;
`;

const dashboardContent = `import React from 'react';
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
`;

// Write files with LF line endings
fs.writeFileSync('src/pages/Admin.tsx', adminContent, 'utf8');
fs.writeFileSync('src/pages/Dashboard.tsx', dashboardContent, 'utf8');

console.log('Fixed both Admin.tsx and Dashboard.tsx with proper line endings and no control characters');
