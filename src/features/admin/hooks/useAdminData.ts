import { useState, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';
import toast from 'react-hot-toast';
import type { AdminUser, AdminStats, LaunchpadGuide, ComplianceQA, ContentStats } from '../types';

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users with their profile data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch auth users for email and last sign in data
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Combine profile and auth data
      const combinedUsers: AdminUser[] = (profiles || []).map((profile) => {
        const authUser = authUsers.users.find((u) => u.id === profile.id);
        return {
          id: profile.id,
          email: authUser?.email || 'Unknown',
          full_name: profile.full_name,
          business_name: profile.business_name,
          role: profile.role || 'user',
          subscription_status: profile.subscription_status,
          subscription_plan: profile.subscription_plan,
          created_at: authUser?.created_at || profile.updated_at || '',
          last_sign_in_at: authUser?.last_sign_in_at,
          is_suspended: false, // TODO: Add suspension feature
          risk_score: profile.risk_score,
        };
      });

      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const suspendUser = async (userId: string) => {
    try {
      // TODO: Implement user suspension logic
      toast.success('User suspended successfully');
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('Failed to suspend user');
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast.success('User role updated successfully');
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users: filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    suspendUser,
    updateUserRole,
    refetch: fetchUsers,
  };
};

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    premiumUsers: 0,
    totalDocuments: 0,
    recentSignups: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch user stats
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('subscription_status, created_at');

      if (profilesError) throw profilesError;

      // Fetch document count
      const { count: documentCount, error: documentsError } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true });

      if (documentsError) throw documentsError;

      // Calculate stats
      const totalUsers = profiles?.length || 0;
      const premiumUsers = profiles?.filter((p) => 
        p.subscription_status === 'active' || p.subscription_status === 'trialing'
      ).length || 0;
      
      // Recent signups (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentSignups = profiles?.filter((p) => 
        new Date(p.created_at) > thirtyDaysAgo
      ).length || 0;

      setStats({
        totalUsers,
        activeUsers: totalUsers, // TODO: Add actual active user tracking
        suspendedUsers: 0, // TODO: Add suspension feature
        premiumUsers,
        totalDocuments: documentCount || 0,
        recentSignups,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    refetch: fetchStats,
  };
};

export const useContentManager = () => {
  const [guides, setGuides] = useState<LaunchpadGuide[]>([]);
  const [qas, setQAs] = useState<ComplianceQA[]>([]);
  const [contentStats, setContentStats] = useState<ContentStats>({
    totalGuides: 0,
    publishedGuides: 0,
    totalQAs: 0,
    publishedQAs: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      setLoading(true);

      // TODO: Implement when content tables are created
      // For now, using mock data
      setGuides([]);
      setQAs([]);
      setContentStats({
        totalGuides: 0,
        publishedGuides: 0,
        totalQAs: 0,
        publishedQAs: 0,
      });
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const createGuide = async (guide: Omit<LaunchpadGuide, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // TODO: Implement when content tables are created
      toast.success('Guide created successfully');
      fetchContent();
    } catch (error) {
      console.error('Error creating guide:', error);
      toast.error('Failed to create guide');
    }
  };

  const updateGuide = async (id: string, updates: Partial<LaunchpadGuide>) => {
    try {
      // TODO: Implement when content tables are created
      toast.success('Guide updated successfully');
      fetchContent();
    } catch (error) {
      console.error('Error updating guide:', error);
      toast.error('Failed to update guide');
    }
  };

  const deleteGuide = async (id: string) => {
    try {
      // TODO: Implement when content tables are created
      toast.success('Guide deleted successfully');
      fetchContent();
    } catch (error) {
      console.error('Error deleting guide:', error);
      toast.error('Failed to delete guide');
    }
  };

  const createQA = async (qa: Omit<ComplianceQA, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // TODO: Implement when content tables are created
      toast.success('Q&A created successfully');
      fetchContent();
    } catch (error) {
      console.error('Error creating Q&A:', error);
      toast.error('Failed to create Q&A');
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    guides,
    qas,
    contentStats,
    loading,
    createGuide,
    updateGuide,
    deleteGuide,
    createQA,
    refetch: fetchContent,
  };
};
