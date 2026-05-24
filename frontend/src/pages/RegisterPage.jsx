import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckSquare, Loader } from 'lucide-react';
import { register } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const authData = await register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      loginUser(authData);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4" id="register-page">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-8">

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-sm">
            <CheckSquare size={28} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Create account</h1>
          <p className="text-slate-500 text-sm">Start managing your tasks today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100" role="alert" id="register-error">
            {error}
          </div>
        )}

        <form id="register-form" onSubmit={handleSubmit} noValidate>

          <div className="flex flex-col gap-2 mb-5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider" htmlFor="reg-username">Username *</label>
            <input
              id="reg-username"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username (3-50 chars)"
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2 mb-5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider" htmlFor="reg-email">Email *</label>
            <input
              id="reg-email"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider" htmlFor="reg-password">Password *</label>
              <input
                id="reg-password"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 chars"
                autoComplete="new-password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider" htmlFor="reg-confirm-password">Confirm *</label>
              <input
                id="reg-confirm-password"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? <Loader size={16} className="animate-spin" /> : null}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        <div className="text-center mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" id="go-to-login-link" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
        </div>

      </div>
    </main>
  );
}
