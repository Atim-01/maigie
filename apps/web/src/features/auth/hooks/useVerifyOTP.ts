/**
 * Hook for OTP verification
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import type { OTPRequest } from '../types/auth.types';

export function useVerifyOTP() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: OTPRequest) => authApi.verifyOTP(data),
    onSuccess: () => {
      // Redirect to login after successful OTP verification
      navigate('/login');
    },
  });
}

