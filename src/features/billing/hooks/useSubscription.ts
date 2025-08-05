import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/features/auth';
import { Subscription } from '../types';

const fetchSubscription = async (userId: string): Promise<Subscription | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_plan')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  if (!data || !data.subscription_status) {
    return null;
  }

  return {
    id: data.subscription_plan,
    planId: data.subscription_plan,
    status: data.subscription_status,
  } as Subscription;
};

export const useSubscription = () => {
  const { user } = useUser();

  return useQuery<Subscription | null, Error>(
    ['subscription', user?.id],
    () => fetchSubscription(user!.id),
    { enabled: !!user }
  );
};
