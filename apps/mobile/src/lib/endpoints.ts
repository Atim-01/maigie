/**
 * API Endpoints
 * Centralized endpoint definitions for the mobile app
 */
const versionPrefix = '/api/v1';

export const endpoints = {
  // Authentication endpoints
  auth: {
    login: `${versionPrefix}/auth/login/json`,
    signup: `${versionPrefix}/auth/signup`,
    logout: `${versionPrefix}/auth/logout`,
    forgotPassword: `${versionPrefix}/auth/forgot-password`,
    verifyOtp: `${versionPrefix}/auth/verify-otp`,
    resetPassword: `${versionPrefix}/auth/reset-password`,
  },
  
  // User endpoints (add more as needed)
  users: {
    me: `${versionPrefix}/users/me`,
    profile: `${versionPrefix}/users/profile`,
    updateProfile: `${versionPrefix}/users/profile`,
  },
  
  // Add more endpoint groups as your API grows
} as const;

// Type helper for endpoint paths
export type EndpointPath = typeof endpoints[keyof typeof endpoints][keyof typeof endpoints[keyof typeof endpoints]];

