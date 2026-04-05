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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Leave Requests</h1>
          <p className="text-gray-500 mt-1">Submit and track your leave statuses.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Submit Leave</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Reason</th>
              <th className="px-6 py-4 font-semibold">From</th>
              <th className="px-6 py-4 font-semibold">To</th>
              <th className="px-6 py-4 font-semibold">Status</th>
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
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' : leave.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
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
