import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, addStudentsBulk, updateStudentStatus } from '../../store/slices/studentSlice';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { Input } from '../../components/UI/Input';
import { Upload, FileSpreadsheet, User, Edit } from 'lucide-react';

export default function AdminStudents() {
  const dispatch = useDispatch();
  const { items: students, loading } = useSelector(state => state.students);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    try {
      setUploadStatus({ type: 'loading', msg: 'Uploading...' });
      await dispatch(addStudentsBulk(file)).unwrap();
      setUploadStatus({ type: 'success', msg: 'Students added successfully!' });
      dispatch(fetchStudents());
      setTimeout(() => { setModalOpen(false); setFile(null); setUploadStatus(null); }, 1500);
    } catch (error) {
      setUploadStatus({ type: 'error', msg: error || 'Upload failed' });
    }
  };

  const handleOpenReview = (student) => {
    setSelectedStudent(student);
    setReviewModalOpen(true);
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedStudent) return;
    await dispatch(updateStudentStatus({ 
      id: selectedStudent.id, 
      status,
      studentData: selectedStudent 
    }));
    setReviewModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 lg:mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">Manage Students</h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base lg:text-lg">View registered students or bulk add via Excel.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="w-full sm:w-auto shadow-lg shadow-brand-100">
          <Upload className="h-5 w-5 mr-2" />
          Bulk Upload Students
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left text-sm md:text-base text-gray-600 border-collapse min-w-[800px]">
          <thead className="bg-gray-50/50 text-gray-700">
            <tr>
              <th className="px-6 py-5 font-semibold">Student</th>
              <th className="px-6 py-5 font-semibold">Course & Campus</th>
              <th className="px-6 py-5 font-semibold">CNIC / ID</th>
              <th className="px-6 py-5 font-semibold">Status</th>
              <th className="px-6 py-5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-gray-400 font-medium">No students found</td></tr>
            ) : students.map(student => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {student.image_url ? (
                      <img src={student.image_url} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                         <User size={20} />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-gray-900">{student.full_name}</div>
                      <div className="text-xs text-gray-500 font-medium">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="font-medium text-gray-800">{student.course}</div>
                   <div className="text-xs text-brand-600 font-bold uppercase tracking-wider">{student.campus}</div>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-gray-600">{student.cnic}</td>
                <td className="px-6 py-4">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                     student.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                     student.status === 'accepted' ? 'bg-green-50 text-green-600 border border-green-100' :
                     'bg-red-50 text-red-600 border border-red-100'
                   }`}>
                      {student.status || 'pending'}
                   </span>
                </td>
                <td className="px-6 py-4">
                  <Button variant="outline" size="sm" onClick={() => handleOpenReview(student)}>
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Upload Students via Excel">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="flex justify-center flex-col items-center p-8 border-2 border-dashed border-gray-300 rounded-2xl">
            <FileSpreadsheet className="h-10 w-10 text-gray-400 mb-3" />
            <p className="text-sm text-gray-500 mb-4 text-center">
              Upload an Excel file (.xlsx) containing columns: <br/> <strong>cnic</strong> and <strong>roll_number</strong>
            </p>
            <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} required className="w-full max-w-xs" />
          </div>
          
          {uploadStatus && (
            <div className={`p-3 rounded-lg text-sm ${uploadStatus.type === 'error' ? 'bg-red-50 text-red-600' : uploadStatus.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
              {uploadStatus.msg}
            </div>
          )}

          <div className="pt-4 flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={!file || uploadStatus?.type === 'loading'}>Upload</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Admission Application Review">
        {selectedStudent && (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-4">
              {selectedStudent.image_url ? (
                <img src={selectedStudent.image_url} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <User size={24} />
                </div>
              )}
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{selectedStudent.full_name}</h4>
                <p className="text-gray-500 font-medium">{selectedStudent.email}</p>
                <p className="text-xs font-mono text-gray-500">{selectedStudent.phone}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Application Details</h4>
              <p><span className="font-medium text-gray-500">CNIC:</span> <span className="font-mono">{selectedStudent.cnic}</span></p>
              <p><span className="font-medium text-gray-500">Gender:</span> <span className="capitalize">{selectedStudent.gender || 'N/A'}</span></p>
              <p><span className="font-medium text-gray-500">Course:</span> {selectedStudent.course}</p>
              <p><span className="font-medium text-gray-500">Campus:</span> {selectedStudent.campus}</p>
              <p><span className="font-medium text-gray-500">Qualification:</span> {selectedStudent.last_qualification || 'N/A'}</p>
              <p><span className="font-medium text-gray-500">Applied on:</span> {new Date(selectedStudent.created_at).toLocaleDateString()}</p>
            </div>

            <div className="pt-6 flex justify-end space-x-3 border-t border-gray-100">
              <Button type="button" variant="ghost" onClick={() => setReviewModalOpen(false)}>Close</Button>
              <Button type="button" variant="danger" onClick={() => handleStatusUpdate('rejected')} disabled={selectedStudent.status === 'rejected'}>
                Reject
              </Button>
              <Button type="button" onClick={() => handleStatusUpdate('accepted')} className="bg-green-600 hover:bg-green-700 text-white border-green-700" disabled={selectedStudent.status === 'accepted'}>
                Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
