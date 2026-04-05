import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaves, submitLeave } from '../../store/slices/leaveSlice';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { Input } from '../../components/UI/Input';

export default function StudentLeaves() {
  const dispatch = useDispatch();
  const { items: leaves, loading } = useSelector(state => state.leaves);
  const { studentData } = useSelector(state => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ reason: '', date_from: '', date_to: '' });

  useEffect(() => {
    if (studentData?.id) dispatch(fetchLeaves(studentData.id));
  }, [dispatch, studentData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(submitLeave({ ...formData, student_id: studentData.id, status: 'Pending' }));
    setModalOpen(false);
    setFormData({ reason: '', date_from: '', date_to: '' });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 lg:mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">My Leave Requests</h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base lg:text-lg">Submit and track your leave statuses.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="w-full sm:w-auto shadow-lg shadow-brand-100">Submit Leave</Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left text-sm md:text-base text-gray-600 border-collapse min-w-[600px]">
          <thead className="bg-gray-50/50 text-gray-700">
            <tr>
              <th className="px-6 py-5 md:px-8 font-semibold">Reason</th>
              <th className="px-6 py-5 md:px-8 font-semibold">From</th>
              <th className="px-6 py-5 md:px-8 font-semibold">To</th>
              <th className="px-6 py-5 md:px-8 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-8">Loading...</td></tr>
            ) : leaves.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-8">No leaves submitted yet.</td></tr>
            ) : (
              leaves.map(leave => (
                <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{leave.reason}</td>
                  <td className="px-6 py-4">{leave.date_from}</td>
                  <td className="px-6 py-4">{leave.date_to}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${leave.status === 'approved' ? 'bg-green-100 text-green-700' : leave.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Submit Leave Request">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Reason" 
            required 
            value={formData.reason} 
            onChange={(e) => setFormData(f => ({ ...f, reason: e.target.value }))} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              type="date" 
              label="From Date" 
              required 
              value={formData.date_from}
              onChange={(e) => setFormData(f => ({ ...f, date_from: e.target.value }))} 
            />
            <Input 
              type="date" 
              label="To Date" 
              required 
              value={formData.date_to}
              onChange={(e) => setFormData(f => ({ ...f, date_to: e.target.value }))} 
            />
          </div>
          <Input type="file" label="Supporting Document/Image (Optional)" />
          
          <div className="pt-4 flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
