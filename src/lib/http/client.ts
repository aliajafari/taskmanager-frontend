import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { authUtils } from '../auth/authUtils';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        const method = config.method?.toUpperCase();
        const url = config.url || '';
        
        const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
        
        if (!isAuthEndpoint) {
          const token = authUtils.getToken();
          if (token) {
            if (config.headers) {
              if (typeof config.headers.set === 'function') {
                config.headers.set('Authorization', `Bearer ${token}`);
              } else {
                (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
              }
            }
            if (process.env.NODE_ENV === 'development') {
              console.log('Token added to request:', method, config.url, token.substring(0, 20) + '...');
            }
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.warn('No token found for request:', method, config.url);
              if (typeof window !== 'undefined') {
                console.log('Available cookies:', document.cookie);
              }
            }
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          authUtils.clearToken();
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const httpClient = new HttpClient();

