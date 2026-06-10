import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Briefcase, LogOut, LayoutDashboard, FileText, Settings, ClipboardList, User, Calendar, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin, isCandidate } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 dark:bg-gray-800 text-white shadow-lg transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <Briefcase className="w-6 h-6" />
            <span>SmartHire</span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/jobs" className="hover:text-indigo-200 flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>Jobs</span>
                </Link>
                {isCandidate && (
                  <Link to="/my-applications" className="hover:text-indigo-200 flex items-center space-x-1">
                    <ClipboardList className="w-4 h-4" />
                    <span>My Applications</span>
                  </Link>
                )}
                {isAdmin && (
                  <>
                    <Link to="/dashboard" className="hover:text-indigo-200 flex items-center space-x-1">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/manage-jobs" className="hover:text-indigo-200 flex items-center space-x-1">
                      <Settings className="w-4 h-4" />
                      <span>Manage Jobs</span>
                    </Link>
                    <Link to="/manage-applications" className="hover:text-indigo-200 flex items-center space-x-1">
                      <ClipboardList className="w-4 h-4" />
                      <span>Applications</span>
                    </Link>
                  </>
                )}
                {!isAdmin && (
                  <>
                    <Link to="/my-interviews" className="hover:text-indigo-200 flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>My Interviews</span>
                    </Link>
                    <Link to="/profile" className="hover:text-indigo-200 flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-sm">Welcome, {user.fullName}</span>
                  <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 hover:text-indigo-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-200">Login</Link>
                <Link to="/register" className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
