import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types';

export const useRoleGuard = () => {
  const { profile, hasRole, user } = useAuthStore();

  const requireRole = (requiredRole: UserRole): boolean => {
    if (!user || !profile) {
      return false;
    }
    return hasRole(requiredRole);
  };

  const isAdmin = (): boolean => {
    return requireRole('admin');
  };

  const isUser = (): boolean => {
    return requireRole('user');
  };

  return {
    requireRole,
    isAdmin,
    isUser,
    currentRole: profile?.role,
  };
};
