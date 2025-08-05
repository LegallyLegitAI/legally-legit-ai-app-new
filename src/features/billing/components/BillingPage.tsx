import React from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { SubscribeButton } from '../components/SubscribeButton';
import { ManageSubscriptionButton } from '../components/ManageSubscriptionButton';
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export const BillingPage: React.FC = () => {
  const { data: subscription, isLoading } = useSubscription();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Billing & Plans</h1>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SUBSCRIPTION_PLANS.map((plan: SubscriptionPlan) => (
            <Card key={plan.id} className={plan.popular ? 'border-primary' : ''}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">${plan.price}/month</div>
                <ul className="list-disc list-inside mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                {subscription?.planId === plan.stripePriceId ? (
                  <ManageSubscriptionButton />
                ) : (
                  <SubscribeButton priceId={plan.stripePriceId} planName={plan.name} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
