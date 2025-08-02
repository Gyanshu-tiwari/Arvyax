import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { LogOut, User, Plus, Home, BookOpen } from 'lucide-react';



export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Hide navbar on login and register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  if (isAuthPage) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Arvyax</span>
            </Link>
          </div>

          {/* Hamburger for mobile */}
          {user && (
            <div className="flex items-center lg:hidden">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          )}

          {/* Desktop menu */}
          {user && (
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
              >
                <Home size={16} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/my-sessions"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
              >
                <BookOpen size={16} />
                <span>My Sessions</span>
              </Link>
              <Link
                to="/create-session"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors"
              >
                <Plus size={16} />
                <span>Create Session</span>
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  <User size={16} />
                  <span>{user.email}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Mobile menu dropdown */}
        {user && menuOpen && (
          <div className="lg:hidden mt-2 space-y-1 px-2 pb-3">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium flex items-center space-x-1 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/my-sessions"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium flex items-center space-x-1 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <BookOpen size={18} />
              <span>My Sessions</span>
            </Link>
            <Link
              to="/create-session"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-base font-medium flex items-center space-x-1 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <Plus size={18} />
              <span>Create Session</span>
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex items-center space-x-2 px-3 py-2">
              <User size={18} />
              <span className="text-gray-700 font-medium">{user.email}</span>
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="ml-auto flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};