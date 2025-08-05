
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        await supabase
          .from('profiles')
          .update({ 
            subscription_status: subscription.status,
            subscription_plan: subscription.items.data[0].price.id,
          })
          .eq('id', userId);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        const userId = subscription.metadata.userId;

        await supabase
          .from('profiles')
          .update({ 
            subscription_status: subscription.status,
            subscription_plan: subscription.items.data[0].price.id,
          })
          .eq('id', userId);
        break;
      }
      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send({ received: true });
  } catch (err) {
    const error = err as Error;
    console.error(`Webhook Error: ${error.message}`);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}

