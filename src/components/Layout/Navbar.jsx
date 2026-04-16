import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../UI/Button';
import { logout } from '../../store/slices/authSlice';
import { LogOut, User, Menu, X, Home as HomeIcon } from 'lucide-react';
import { Logo } from '../UI/Logo';
import { supabase } from '../../config/supabase';
import Swal from 'sweetalert2';

export default function Navbar() {
  const { isAuthenticated, role, user } = useSelector(state => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileCourseOpen, setIsMobileCourseOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleCheckResult = async () => {
    setIsMenuOpen(false);
    const { value: cnic } = await Swal.fire({
      title: 'Check Application Result',
      input: 'text',
      inputLabel: 'Enter your CNIC (e.g., 42101-1234567-1)',
      inputPlaceholder: 'Enter CNIC Number',
      showCancelButton: true,
      confirmButtonText: 'Check Status',
      confirmButtonColor: '#0d9488',
      inputValidator: (value) => {
        if (!value) return 'CNIC is required!';
      }
    });

    if (cnic) {
      Swal.fire({
        title: 'Checking...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      try {
        const { data: student } = await supabase
          .from('students')
          .select('*')
          .eq('cnic', cnic.trim())
          .maybeSingle();

        if (student) {
          Swal.fire({
            icon: 'success',
            title: 'Congratulations!',
            text: 'You have been selected! Please setup your portal account.',
            confirmButtonText: 'Setup Account',
            confirmButtonColor: '#0d9488'
          }).then((res) => {
             if (res.isConfirmed) navigate('/login?role=student&signup=true');
          });
          return;
        }

        const { data: admission } = await supabase
          .from('admissions')
          .select('status')
          .eq('cnic', cnic.trim())
          .maybeSingle();

        if (admission) {
          if (admission.status === 'rejected') {
            Swal.fire({
              icon: 'error',
              title: 'Application Rejected',
              text: 'We regret to inform you that you were not selected. Try next time!',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Try Next Time'
            });
          } else {
            Swal.fire({
              icon: 'info',
              title: 'Application Pending',
              text: 'Your application is still under review. Please check again later.',
            });
          }
        } else {
           Swal.fire({
              icon: 'warning',
              title: 'No Record Found',
              text: 'We could not find any application with this CNIC.',
           });
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to check result. Try again.', 'error');
      }
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-100 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex justify-between h-16 md:h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="transition-transform duration-300 group-hover:scale-105 select-none">
                <Logo />
              </div>
              <div className="h-8 md:h-10 w-px bg-gray-200 mx-3 md:mx-4 hidden sm:block"></div>
              <span className="font-extrabold text-lg md:text-xl text-gray-800 tracking-tight hidden sm:block">Connect Portal</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center space-x-6 lg:space-x-10">
              <Link to="/" className="text-sm lg:text-base font-bold text-gray-700 hover:text-brand-600 active:scale-95 transition-all">Home</Link>
              {role !== 'student' && (
                <div className="group relative py-4">
                  <Link to="/courses" className="flex items-center text-sm lg:text-base font-bold text-gray-700 hover:text-brand-600 active:scale-95 transition-all">
                    Courses
                    <svg className="w-4 h-4 ml-1 group-hover:-rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </Link>
                  {/* Dropdown Box */}
                  <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50 overflow-hidden">
                    <div className="p-2 space-y-1">
                      <Link to="/courses?category=web-development" className="block px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-brand-50 hover:text-brand-700 rounded-lg transition-colors">Web & App Development</Link>
                      <Link to="/courses?category=graphic-design" className="block px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-brand-50 hover:text-brand-700 rounded-lg transition-colors">Graphic Design</Link>
                      <Link to="/courses?category=digital-marketing" className="block px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-brand-50 hover:text-brand-700 rounded-lg transition-colors">Digital Marketing</Link>
                      <Link to="/courses?category=python-programming" className="block px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-brand-50 hover:text-brand-700 rounded-lg transition-colors">Python Programming</Link>
                    </div>
                  </div>
                </div>
              )}
              <a 
                href="/#about" 
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-sm lg:text-base font-bold text-gray-700 hover:text-brand-600 active:scale-95 transition-all"
              >
                About
              </a>
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
              <div className="flex items-center space-x-4">
                <button onClick={handleCheckResult} className="text-sm border border-brand-200 lg:text-base font-bold text-brand-700 hover:bg-brand-50 px-3 py-1.5 rounded-xl transition-all">
                  Check Result
                </button>
                <Link to="/login?role=student" className="text-sm lg:text-base font-bold text-gray-700 hover:text-brand-600 transition-all mr-2">
                  Login
                </Link>
                <Link to="/registration">
                  <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:shadow-lg hover:shadow-blue-200 text-white font-bold rounded-2xl px-6 h-12 transition-all">
                    Enroll Now
                  </Button>
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
                  <Button variant="ghost" className="w-full justify-start text-gray-700">
                    <HomeIcon className="h-5 w-5 mr-3" />
                    Home
                  </Button>
                </Link>
                <div>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between text-gray-700" 
                    onClick={() => setIsMobileCourseOpen(!isMobileCourseOpen)}
                  >
                    <div className="flex items-center">
                      <Menu className="h-5 w-5 mr-3" />
                      Courses
                    </div>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isMobileCourseOpen ? '-rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </Button>
                  
                  {isMobileCourseOpen && (
                    <div className="pl-11 pr-4 py-2 space-y-2 border-l-2 border-brand-100 ml-5 mt-1 bg-gray-50/50 rounded-r-lg">
                      <Link to="/courses?category=web-development" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-600 hover:text-brand-600">Web & App Development</Link>
                      <Link to="/courses?category=graphic-design" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-600 hover:text-brand-600">Graphic Design</Link>
                      <Link to="/courses?category=digital-marketing" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-600 hover:text-brand-600">Digital Marketing</Link>
                      <Link to="/courses?category=python-programming" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-600 hover:text-brand-600">Python Programming</Link>
                    </div>
                  )}
                </div>
                <a 
                  href="/#about" 
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    if (window.location.pathname === '/') {
                      e.preventDefault();
                      setTimeout(() => {
                        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }}
                  className="block w-full"
                >
                  <Button variant="ghost" className="w-full justify-start text-gray-700 pointer-events-none">
                    <User className="h-5 w-5 mr-3" />
                    About
                  </Button>
                </a>
                <Button variant="outline" className="w-full justify-start border-brand-200 text-brand-700" onClick={handleCheckResult}>
                  Check Result
                </Button>
                <Link to="/login?role=student" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start border-brand-200 text-brand-700">
                    Login
                  </Button>
                </Link>
                <Link to="/registration" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full justify-start bg-gradient-to-r from-teal-500 to-blue-600 hover:shadow-lg hover:shadow-blue-200 text-white font-bold border-none shadow-sm">
                    Enroll Now
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
