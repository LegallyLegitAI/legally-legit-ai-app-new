import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/components';
import { Button } from '@/shared/components';

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

