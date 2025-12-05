/**
 * Hook for user login
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../store/authStore';
import type { UserLogin } from '../types/auth.types';

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (data: UserLogin) => authApi.login(data),
    onSuccess: async (tokenResponse) => {
      // Get user data and store auth state
      try {
        const user = await authApi.getCurrentUser();
        login(tokenResponse, user);
        navigate('/dashboard'); // TODO: Update to actual dashboard route
      } catch (error) {
        console.error('Failed to get user data:', error);
      }
    },
  });
}

