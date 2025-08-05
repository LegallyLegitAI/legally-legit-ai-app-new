export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  popular?: boolean;
}

export interface Subscription {
  id: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
  planId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface BillingInfo {
  subscription: Subscription | null;
  paymentMethod: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    currency: 'AUD',
    interval: 'month',
    features: [
      '5 document generations per month',
      'Basic templates',
      'Email support',
      'Basic compliance checks'
    ],
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_STARTER || '',
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 99,
    currency: 'AUD',
    interval: 'month',
    features: [
      'Unlimited document generations',
      'All premium templates',
      'Priority support',
      'Advanced compliance checks',
      'Custom document templates',
      'API access',
      'Team collaboration'
    ],
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_PRO || '',
    popular: true,
  }
];
