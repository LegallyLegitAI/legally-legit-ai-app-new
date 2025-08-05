export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  business_name: string | null;
  role: string;
  subscription_status: string | null;
  subscription_plan: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  is_suspended: boolean | null;
  risk_score: number | null;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  premiumUsers: number;
  totalDocuments: number;
  recentSignups: number;
}

export interface LaunchpadGuide {
  id: string;
  title: string;
  content: string;
  category: string;
  order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComplianceQA {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentStats {
  totalGuides: number;
  publishedGuides: number;
  totalQAs: number;
  publishedQAs: number;
}
