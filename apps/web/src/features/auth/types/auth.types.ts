/**
 * Authentication types and interfaces
 */

export interface UserSignup {
  email: string;
  password: string;
  name: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  tier: string;
  isActive: boolean;
  preferences?: {
    theme: string;
    language: string;
    notifications: boolean;
  };
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface OTPRequest {
  email: string;
  code: string;
}

export interface AuthError {
  message: string;
  code?: string;
  statusCode?: number;
}

