import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          business_name: string | null;
          business_type: string | null;
          business_size: string | null;
          industry: string | null;
          abn: string | null;
          subscription_status: string | null;
          subscription_plan: string | null;
          stripe_customer_id: string | null;
          risk_score: number | null;
          onboarding_completed: boolean | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          business_name?: string | null;
          business_type?: string | null;
          business_size?: string | null;
          industry?: string | null;
          abn?: string | null;
          subscription_status?: string | null;
          subscription_plan?: string | null;
          stripe_customer_id?: string | null;
          risk_score?: number | null;
          onboarding_completed?: boolean | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          business_name?: string | null;
          business_type?: string | null;
          business_size?: string | null;
          industry?: string | null;
          abn?: string | null;
          subscription_status?: string | null;
          subscription_plan?: string | null;
          stripe_customer_id?: string | null;
          risk_score?: number | null;
          onboarding_completed?: boolean | null;
        };
      };
      documents: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string | null;
          user_id: string;
          title: string;
          content: string;
          document_type: string;
          status: string;
          metadata: Record<string, unknown> | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string | null;
          user_id: string;
          title: string;
          content: string;
          document_type: string;
          status?: string;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string | null;
          user_id?: string;
          title?: string;
          content?: string;
          document_type?: string;
          status?: string;
          metadata?: Record<string, unknown> | null;
        };
      };
      risk_assessments: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          assessment_type: string;
          score: number;
          recommendations: Record<string, unknown> | null;
          status: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          assessment_type: string;
          score: number;
          recommendations?: Record<string, unknown> | null;
          status?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          assessment_type?: string;
          score?: number;
          recommendations?: Record<string, unknown> | null;
          status?: string;
        };
      };
    };
  };
};
