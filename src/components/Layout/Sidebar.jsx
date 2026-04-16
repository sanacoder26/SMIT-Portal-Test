import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Users, Calendar, LayoutDashboard } from 'lucide-react';

const adminLinks = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Courses', path: '/admin/courses', icon: BookOpen },
  { name: 'Students', path: '/admin/students', icon: Users },
  { name: 'Leave Requests', path: '/admin/leaves', icon: Calendar },
];

const studentLinks = [
  { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
  { name: 'My Leaves', path: '/student/leaves', icon: Calendar },
];

export default function Sidebar({ role }) {
  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <div className="w-full bg-white border-r border-gray-200 h-full flex flex-col pt-6 px-4">
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition duration-150 group ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 font-bold shadow-sm shadow-brand-50/50'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
              end={link.path === '/admin'}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-brand-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  <span className="font-medium tracking-tight">{link.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
