'use client';

import { useForm } from 'react-hook-form';
import { LoginCredentials } from '@/lib/auth/authApi';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Error } from '@/components/ui/error';

export default function LoginPage() {
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = (data: LoginCredentials) => {
    loginMutation.mutate(data);
  };

  const errorMessage =
    loginMutation.error &&
    ((loginMutation.error as any).response?.data?.message ||
      (loginMutation.error as any).message ||
      'Login failed. Please check your credentials.');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {errorMessage && <Error message={errorMessage} />}
          
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={errors.password?.message}
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

