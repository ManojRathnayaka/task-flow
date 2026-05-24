import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar — top navigation bar shown when the user is authenticated.
 */
export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-200 dark:border-neutral-800 px-4 sm:px-6 shadow-sm" id="main-navbar">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-12">

        <Link to="/dashboard" className="flex items-center gap-2.5 text-slate-900 dark:text-white no-underline hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <CheckSquare size={16} color="white" />
          </div>
          <span className="text-lg font-bold">TaskFlow</span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-gray-300 text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 flex items-center justify-center font-bold text-slate-700 dark:text-gray-200 text-xs">
                {user.username?.[0]?.toUpperCase()}
              </div>
              <span className="hidden sm:inline">{user.username}</span>
            </div>
          )}
          <button
            id="logout-btn"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-gray-300 bg-white dark:bg-black border border-slate-200 dark:border-neutral-700 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors shadow-sm"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </div>
    </nav>
  );
}
