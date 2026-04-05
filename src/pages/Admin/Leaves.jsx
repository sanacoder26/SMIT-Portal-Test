import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaves, updateLeaveStatus } from '../../store/slices/leaveSlice';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';

export default function AdminLeaves() {
  const dispatch = useDispatch();
  const { items: leaves, loading } = useSelector(state => state.leaves);
  
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchLeaves());
  }, [dispatch]);

  const handleOpenModal = (leave) => {
    setSelectedLeave(leave);
    setModalOpen(true);
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedLeave) return;
    await dispatch(updateLeaveStatus({ id: selectedLeave.id, status }));
    setModalOpen(false);
  };

  return (
    <div>
      <div className="mb-10 lg:mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">Review Leave Requests</h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base lg:text-lg">Approve or reject student leave applications.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left text-sm md:text-base text-gray-600 border-collapse min-w-[700px]">
          <thead className="bg-gray-50/50 text-gray-700">
            <tr>
              <th className="px-6 py-5 md:px-8 font-semibold">Student Context</th>
              <th className="px-6 py-5 md:px-8 font-semibold">Reason</th>
              <th className="px-6 py-5 md:px-8 font-semibold">Dates</th>
              <th className="px-6 py-5 md:px-8 font-semibold">Status</th>
              <th className="px-6 py-5 md:px-8 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
            ) : leaves.map(leave => (
              <tr key={leave.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-xs font-medium text-gray-900 space-y-1">
                  <div>CNIC: {leave.students?.cnic}</div>
                  <div>Roll: {leave.students?.roll_number}</div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-xs">{leave.reason}</td>
                <td className="px-6 py-4 text-xs">
                  {leave.date_from} <br/>to<br/> {leave.date_to}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${leave.status === 'approved' ? 'bg-green-100 text-green-700' : leave.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {leave.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Button variant="outline" size="sm" onClick={() => handleOpenModal(leave)}>Review</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Leave Request Review">
        {selectedLeave && (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-2">Student Info</h4>
              <p>CNIC: {selectedLeave.students?.cnic}</p>
              <p>Roll Number: {selectedLeave.students?.roll_number}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Leave Details</h4>
              <p><span className="font-medium">Dates:</span> {selectedLeave.date_from} to {selectedLeave.date_to}</p>
              <p><span className="font-medium">Reason:</span></p>
              <p className="bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedLeave.reason}</p>
            </div>

            <div className="pt-6 flex justify-end space-x-3 border-t border-gray-100">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Close</Button>
              <Button type="button" variant="danger" onClick={() => handleStatusUpdate('Rejected')} disabled={selectedLeave.status === 'Rejected'}>
                Reject
              </Button>
              <Button type="button" onClick={() => handleStatusUpdate('Approved')} className="bg-green-600 hover:bg-green-700 text-white" disabled={selectedLeave.status === 'Approved'}>
                Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
