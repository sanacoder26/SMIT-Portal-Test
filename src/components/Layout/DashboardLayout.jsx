import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({ role }) {
  const { isAuthenticated, role: userRole } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (userRole !== role) return <Navigate to="/" replace />;

  return (
    <div className="flex-1 flex overflow-hidden relative">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-brand-600 text-white rounded-full shadow-xl"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - fixed on desktop, sliding on mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 lg:w-72 bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar role={role} />
      </div>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-3 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto backdrop-blur-sm bg-white/40 p-3 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-8rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
