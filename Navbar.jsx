import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 text-blue-600 font-bold text-xl">
          <Activity size={22} className="text-blue-600" />
          <span className="text-gray-900">MedFlow</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <Link to="/doctors" className="hover:text-gray-900 transition-colors">Doctors</Link>
          <Link to="/patients" className="hover:text-gray-900 transition-colors">Patients</Link>
          <Link to="/schedule" className="hover:text-gray-900 transition-colors">Schedule</Link>
          <Link to="/records" className="hover:text-gray-900 transition-colors">Records</Link>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden md:block">
                <User size={14} className="inline mr-1" />{user.name}
              </span>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-5">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
