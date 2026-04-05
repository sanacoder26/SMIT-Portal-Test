import React, { useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';

export default function DashboardLayout({ role }) {
  const { isAuthenticated, role: userRole } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (userRole !== role) return <Navigate to="/" replace />; // or to their respective dashboard

  return (
    <div className="flex-1 flex overflow-hidden">
      <Sidebar role={role} />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6 sm:p-8">
        <div className="max-w-7xl mx-auto backdrop-blur-sm bg-white/40 p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-8rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
