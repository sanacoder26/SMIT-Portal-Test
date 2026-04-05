import React, { useState } from 'react';
import { Users, BookOpen, Calendar, ShieldCheck, UserPlus, AlertCircle } from 'lucide-react';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { Input } from '../../components/UI/Input';
import { supabase } from '../../config/supabase';

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    confirmPassword: '' 
  });

  const stats = [
    { name: 'Total Students', value: '2, 845', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Courses', value: '14', icon: BookOpen, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Pending Leaves', value: '38', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Admins', value: '5', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: 'error', msg: 'Passwords do not match' });
      return;
    }

    try {
      setLoading(true);
      setStatus(null);
      
      const { error } = await supabase.from('users').insert([{
        username: formData.username,
        password: formData.password,
        role: 'admin'
      }]);

      if (error) throw error;

      setStatus({ type: 'success', msg: 'Admin account created successfully!' });
      setTimeout(() => {
        setModalOpen(false);
        setFormData({ username: '', password: '', confirmPassword: '' });
        setStatus(null);
      }, 1500);
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Failed to create admin' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 lg:mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base lg:text-lg">Overview of your SMIT portal.</p>
        </div>
        <Button 
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto shadow-lg shadow-brand-100"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add New Admin
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-10 lg:mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 lg:p-10">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start space-x-3">
            <div className="p-2 bg-brand-100 rounded-lg text-brand-600 mt-1">
              <AlertCircle className="h-4 w-4" />
            </div>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Admin system initialization complete. Use the sidebar to navigate and manage Courses, Students, and Leaves. 
              You can now add more administrators to help manage the portal.
            </p>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Admin User Management"
        description="Create a new administrator account with system-wide privileges."
      >
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <Input 
            label="Admin Email/Username" 
            placeholder="admin@example.com"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <Input 
            label="Password" 
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Input 
            label="Confirm Password" 
            type="password"
            placeholder="••••••••"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />

          {status && (
            <div className={`p-4 rounded-xl text-sm flex items-center ${status.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
              <AlertCircle className="h-4 w-4 mr-2" />
              {status.msg}
            </div>
          )}

          <div className="pt-4 flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Admin Account'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
