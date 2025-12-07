import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi, LoginCredentials } from '@/lib/auth/authApi';
import { authUtils } from '@/lib/auth/authUtils';

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: async (response) => {
      if (response.success && response.data?.token) {
        authUtils.setToken(response.data.token);
        await new Promise((resolve) => setTimeout(resolve, 200));
        if (typeof window !== 'undefined') {
          window.location.href = '/tasks';
        } else {
          router.push('/tasks');
          router.refresh();
        }
      }
    },
  });
};

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      authUtils.clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      } else {
        router.push('/login');
        router.refresh();
      }
    },
  });
};

