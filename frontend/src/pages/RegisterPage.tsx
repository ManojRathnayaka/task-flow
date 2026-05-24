import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckSquare, Loader, Moon, Sun } from 'lucide-react';
import { register as registerApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const registerSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  });

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const onSubmit = async (data: RegisterForm) => {
    setApiError('');
    try {
      const authData = await registerApi({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      loginUser(authData);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as {response?: {data?: {message?: string}}}).response?.data?.message || 'Registration failed. Please try again.';
      setApiError(msg);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-4 relative" id="register-page">
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-4 right-4 p-2 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        title="Toggle theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-md p-8">

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-sm">
            <CheckSquare size={28} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create account</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Start managing your tasks today</p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/50" role="alert" id="register-error">
            {apiError}
          </div>
        )}

        <form id="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>

          <div className="flex flex-col gap-2 mb-5">
            <label className="text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider" htmlFor="reg-username">Username *</label>
            <input
              id="reg-username"
              className={cn(
                "w-full bg-white dark:bg-neutral-900 border shadow-sm rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                errors.username ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-neutral-800 focus:border-blue-500"
              )}
              type="text"
              placeholder="Choose a username"
              autoFocus
              {...register('username')}
            />
            {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
          </div>

          <div className="flex flex-col gap-2 mb-5">
            <label className="text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider" htmlFor="reg-email">Email *</label>
            <input
              id="reg-email"
              className={cn(
                "w-full bg-white dark:bg-neutral-900 border shadow-sm rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                errors.email ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-neutral-800 focus:border-blue-500"
              )}
              type="email"
              placeholder="Enter your email"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider" htmlFor="reg-password">Password *</label>
              <input
                id="reg-password"
                className={cn(
                  "w-full bg-white dark:bg-neutral-900 border shadow-sm rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                  errors.password ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-neutral-800 focus:border-blue-500"
                )}
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider" htmlFor="reg-confirm-password">Confirm *</label>
              <input
                id="reg-confirm-password"
                className={cn(
                  "w-full bg-white dark:bg-neutral-900 border shadow-sm rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                  errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-neutral-800 focus:border-blue-500"
                )}
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            id="register-btn"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader size={16} className="animate-spin" />}
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Sign in
          </Link>
        </p>

      </div>
    </main>
  );
}
