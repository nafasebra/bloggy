'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const forgetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;

export default function ForgetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors , isSubmitting },
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const onSubmit = async (data: ForgetPasswordFormData) => {
    try {
      const response = await fetch('/api/auth/forget-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Password reset link sent to your email!');
      } else {
        toast.error('Failed to send reset email');
      }
    } catch (err) {
      toast.error('Request failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg px-8 py-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
              Forgot your password?
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mt-2 text-sm">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </button>

            <div className="text-center pt-4">
              <a
                href="/auth/login"
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors duration-200"
              >
                Back to login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
