import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

interface ManageSubscriptionButtonProps {
  disabled?: boolean;
  className?: string;
}

export const ManageSubscriptionButton: React.FC<ManageSubscriptionButtonProps> = ({
  disabled = false,
  className
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleManageSubscription = async () => {
    if (!user) {
      toast.error('Please sign in to manage your subscription');
      return;
    }

    setLoading(true);

    try {
      // Get the current session token
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        toast.error('Authentication error. Please sign in again.');
        return;
      }

      // Create portal session
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Customer Portal
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleManageSubscription}
      disabled={disabled || loading}
      className={className}
      variant="outline"
    >
      {loading ? 'Loading...' : 'Manage Subscription'}
    </Button>
  );
};
