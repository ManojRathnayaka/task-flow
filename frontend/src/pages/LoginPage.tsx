import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckSquare, Eye, EyeOff, Loader, Moon, Sun } from 'lucide-react';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
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

  const onSubmit = async (data: LoginForm) => {
    setApiError('');
    try {
      const authData = await login(data);
      loginUser(authData);
      
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get('returnUrl') || '/dashboard';
      navigate(returnUrl);
    } catch (err: unknown) {
      const msg = (err as {response?: {data?: {message?: string}}}).response?.data?.message || 'Login failed. Please check your credentials.';
      setApiError(msg);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-4 relative" id="login-page">
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Welcome back</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Sign in to manage your tasks</p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/50" role="alert" id="login-error">
            {apiError}
          </div>
        )}

        <form id="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-2 mb-5">
            <label className="text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider" htmlFor="login-username">Username</label>
            <input
              id="login-username"
              className={cn(
                "w-full bg-white dark:bg-neutral-900 border shadow-sm rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                errors.username ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-neutral-800 focus:border-blue-500"
              )}
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
              autoFocus
              {...register('username')}
            />
            {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider" htmlFor="login-password">Password</label>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</a>
            </div>
            <div className="relative">
              <input
                id="login-password"
                className={cn(
                  "w-full bg-white dark:bg-neutral-900 border shadow-sm rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all pr-12",
                  errors.password ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-neutral-800 focus:border-blue-500"
                )}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader size={16} className="animate-spin" />}
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
