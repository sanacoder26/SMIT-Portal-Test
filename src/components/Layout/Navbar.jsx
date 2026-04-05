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
              <div className="p-1 bg-white rounded-xl shadow-sm border border-gray-100 mr-2 md:mr-3 group-hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-lg p-1 shadow-sm border border-gray-100 flex items-center justify-center hover:rotate-3 transition-all duration-500">
                  <img 
                    src="/SMIT.jpeg" 
                    alt="SMIT Logo" 
                    className="w-full h-full object-contain rounded-lg" 
                  />
                </div>
              </div>

            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center space-x-6 lg:space-x-10">
              <Link to="/" className="text-sm lg:text-base font-bold text-gray-700 hover:text-brand-600 active:scale-95 transition-all">Home</Link>
              <Link to="/courses" className="px-5 py-2 bg-brand-50 text-brand-700 rounded-full text-sm lg:text-base font-bold hover:bg-brand-100 active:scale-95 transition-all shadow-sm">Courses</Link>
              <Link to="/login?role=student" className="text-sm lg:text-base font-bold text-gray-500 hover:text-brand-600 active:scale-95 transition-all">Student Login</Link>
              <Link to="/login?role=student&signup=true" className="text-sm lg:text-base font-bold text-gray-500 hover:text-brand-600 active:scale-95 transition-all">Signup</Link>
              <Link to={isAuthenticated && role === 'admin' ? "/admin" : "/login?role=admin"} className="text-sm lg:text-base font-bold text-gray-500 hover:text-brand-600 active:scale-95 transition-all">Admin</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end mr-2">
                  <span className="text-xs font-bold text-gray-900 leading-none">{user?.username}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{role}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-10 px-5">
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login?role=student">
                  <Button variant="secondary" className="bg-gray-100/80 hover:bg-gray-200 text-gray-900 font-bold rounded-2xl px-6 h-12">
                    Student Login
                  </Button>
                </Link>
                <Link to={isAuthenticated && role === 'admin' ? "/admin" : "/login?role=admin"}>
                  <Button className="bg-gradient-to-r from-teal-500 to-brand-600 hover:shadow-lg hover:shadow-brand-200 text-white font-bold rounded-2xl px-6 h-12 transition-all">
                    Admin Panel
                  </Button>
                </Link>
              </>
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
                  <Button variant="ghost" className="w-full justify-start text-gray-700">
                    <HomeIcon className="h-5 w-5 mr-3" />
                    Home
                  </Button>
                </Link>
                <Link to="/courses" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start border-brand-100 bg-brand-50 text-brand-700 font-bold">
                    Explore Courses
                  </Button>
                </Link>
                <Link to="/login?role=student" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start border-brand-200 text-brand-700">
                    Student Login
                  </Button>
                </Link>
                <Link to="/login?role=student&signup=true" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-gray-600">
                    Create Account (Signup)
                  </Button>
                </Link>
                <Link to={isAuthenticated && role === 'admin' ? "/admin" : "/login?role=admin"} onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full justify-start bg-gradient-to-r from-teal-500 to-brand-600 text-white font-bold border-none shadow-sm">
                    Admin Panel
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
