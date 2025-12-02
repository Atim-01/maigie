import Constants from 'expo-constants';

// Get API Base URL from environment variables
export const getApiUrl = (): string => {
  const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;
  
  if (!apiBaseUrl) {
    // Fallback for development
    console.warn('API_BASE_URL not configured, using default');
    return __DEV__
      ? 'http://localhost:8000'
      : 'https://api.maigie.com';
  }
  
  return apiBaseUrl;
};

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  token?: string | null; // Auth token
}

export const apiRequest = async <T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const {
    method = 'GET',
    headers: customHeaders,
    body,
    token,
  } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${getApiUrl()}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    
    let data: any;
    if (isJson) {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data?.detail || data?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error: any) {
    // Re-throw with more context if it's not already an Error
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error?.message || 'Network request failed');
  }
};

