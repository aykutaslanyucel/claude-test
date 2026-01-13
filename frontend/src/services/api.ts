import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data!;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data!;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },
};

export const documentApi = {
  upload: async (projectId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse<unknown>>(
      `/documents/${projectId}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  list: async (projectId: string) => {
    const response = await api.get<ApiResponse<unknown[]>>(
      `/documents/${projectId}`
    );
    return response.data.data!;
  },

  get: async (projectId: string, documentId: string) => {
    const response = await api.get<ApiResponse<unknown>>(
      `/documents/${projectId}/${documentId}`
    );
    return response.data.data;
  },

  download: async (projectId: string, documentId: string) => {
    const response = await api.get(
      `/documents/${projectId}/${documentId}/download`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  askQuestion: async (
    projectId: string,
    documentId: string,
    question: string
  ) => {
    const response = await api.post<ApiResponse<{ answer: string }>>(
      `/documents/${projectId}/${documentId}/ask`,
      { question }
    );
    return response.data.data?.answer;
  },

  delete: async (projectId: string, documentId: string) => {
    await api.delete(`/documents/${projectId}/${documentId}`);
  },
};
