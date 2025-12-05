/**
 * Authentication API service
 */

import axios from 'axios';
import type {
  UserSignup,
  UserLogin,
  TokenResponse,
  UserResponse,
  PasswordResetRequest,
  PasswordReset,
  OTPRequest,
} from '../types/auth.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pr-51-api-preview.maigie.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  /**
   * Sign up a new user
   */
  signup: async (data: UserSignup): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/auth/signup', data);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: UserLogin): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/login/json', data);
    return response.data;
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/auth/me');
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (data: PasswordResetRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: PasswordReset): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/reset-password', {
      token: data.token,
      password: data.newPassword,
    });
    return response.data;
  },

  /**
   * Verify OTP (stubbed - will be implemented when backend is ready)
   */
  verifyOTP: async (data: OTPRequest): Promise<{ message: string; verified: boolean }> => {
    // Stub implementation - mock success for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: 'OTP verified successfully',
          verified: true,
        });
      }, 1000);
    });
  },

  /**
   * Resend OTP (stubbed - will be implemented when backend is ready)
   */
  resendOTP: async (email: string): Promise<{ message: string }> => {
    // Stub implementation - mock success for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: 'OTP sent successfully',
        });
      }, 1000);
    });
  },

  /**
   * Get OAuth authorization URL
   */
  oauthAuthorize: async (provider: string, redirectUri?: string): Promise<{ authorization_url: string; state: string; provider: string }> => {
    const params = redirectUri ? `?redirect_uri=${encodeURIComponent(redirectUri)}` : '';
    const response = await apiClient.get<{ authorization_url: string; state: string; provider: string }>(
      `/auth/oauth/${provider}/authorize${params}`
    );
    return response.data;
  },

  /**
   * Exchange OAuth code for access token
   */
  oauthCallback: async (provider: string, code: string, state: string): Promise<TokenResponse> => {
    const response = await apiClient.get<TokenResponse>(
      `/auth/oauth/${provider}/callback`,
      {
        params: { code, state },
      }
    );
    return response.data;
  },
};

