import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar — top navigation bar shown when the user is authenticated.
 */
export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 shadow-sm" id="main-navbar">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">

        <Link to="/dashboard" className="flex items-center gap-2.5 text-slate-900 no-underline hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <CheckSquare size={18} color="white" />
          </div>
          <span className="text-lg font-bold">TaskFlow</span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                {user.username?.[0]?.toUpperCase()}
              </div>
              <span className="hidden sm:inline">{user.username}</span>
            </div>
          )}
          <button
            id="logout-btn"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
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
