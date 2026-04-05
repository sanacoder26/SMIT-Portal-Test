import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../UI/Button';
import { logout } from '../../store/slices/authSlice';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, role, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-brand-700 transition">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-green-500">
                SMIT Portal
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to={role === 'admin' ? '/admin' : '/student'}>
                  <Button variant="ghost" className="hidden sm:flex">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 italic font-semibold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-200 hover:bg-red-50 hover:text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-x-3">
                <Link to="/login?role=student">
                  <Button variant="outline" className="border-brand-200 text-brand-700 hover:bg-brand-50">Student Portal</Button>
                </Link>
                <Link to="/login?role=admin">
                  <Button className="bg-brand-600 hover:bg-brand-700">Admin Login</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
