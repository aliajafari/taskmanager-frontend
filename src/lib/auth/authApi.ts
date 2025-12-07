import { httpClient } from '../http/client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return httpClient.post<LoginResponse>('/auth/login', credentials);
  },
};

