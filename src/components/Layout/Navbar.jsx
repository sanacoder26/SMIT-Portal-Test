import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../UI/Button';
import { logout } from '../../store/slices/authSlice';
import { LogOut, User, Menu, X, Home as HomeIcon } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, role, user } = useSelector(state => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-100 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex justify-between h-16 md:h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-600 rounded-lg flex items-center justify-center mr-2 md:mr-3 group-hover:bg-brand-700 transition shadow-sm shadow-brand-200">
                <span className="text-white font-bold text-lg md:text-xl">S</span>
              </div>
              <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-green-500">
                SMIT Portal
              </span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to={role === 'admin' ? '/admin' : '/student'}>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 italic font-semibold border border-brand-200">
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
                  <Button variant="outline" size="sm" className="border-brand-200 text-brand-700 hover:bg-brand-50">Student Portal</Button>
                </Link>
                <Link to="/login?role=admin">
                  <Button size="sm" className="bg-brand-600 hover:bg-brand-700">Admin Login</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            {isAuthenticated && (
              <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 italic font-semibold border border-brand-200 mr-1">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-in slide-in-from-top duration-300">
          <div className="px-4 py-6 space-y-4">
            {isAuthenticated ? (
              <>
                <Link to={role === 'admin' ? '/admin' : '/student'} aria-label="Dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start text-brand-700 border-brand-100 bg-brand-50/30">
                    <User className="h-5 w-5 mr-3" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-red-100 text-red-600 bg-red-50/30" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <HomeIcon className="h-5 w-5 mr-3" />
                    Home
                  </Button>
                </Link>
                <Link to="/login?role=student" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start border-brand-200 text-brand-700">
                    Student Portal
                  </Button>
                </Link>
                <Link to="/login?role=admin" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full justify-start bg-brand-600">
                    Admin Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
