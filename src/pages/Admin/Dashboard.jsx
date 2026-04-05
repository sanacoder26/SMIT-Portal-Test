import React from 'react';
import { Users, BookOpen, Calendar, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/UI/Button';

export default function Dashboard() {
  const stats = [
    { name: 'Total Students', value: '2,845', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Courses', value: '14', icon: BookOpen, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Pending Leaves', value: '38', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Admins', value: '5', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your SMIT portal.</p>
        </div>
        <Button>Add New Admin</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Admin system initialization complete. Use the sidebar to navigate and manage Courses, Students, and Leaves.</p>
        </div>
      </div>
    </div>
  );
}
