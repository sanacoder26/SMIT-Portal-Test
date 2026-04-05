import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, addStudentsBulk } from '../../store/slices/studentSlice';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { Input } from '../../components/UI/Input';
import { Upload, FileSpreadsheet } from 'lucide-react';

export default function AdminStudents() {
  const dispatch = useDispatch();
  const { items: students, loading } = useSelector(state => state.students);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

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
        <table className="w-full text-left text-sm md:text-base text-gray-600 border-collapse min-w-[600px]">
          <thead className="bg-gray-50/50 text-gray-700">
            <tr>
              <th className="px-6 py-5 md:px-8 font-semibold">CNIC</th>
              <th className="px-6 py-5 md:px-8 font-semibold">Roll Number</th>
              <th className="px-6 py-5 md:px-8 font-semibold">Added At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="3" className="text-center py-8">Loading...</td></tr>
            ) : students.map(student => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{student.cnic}</td>
                <td className="px-6 py-4">{student.roll_number}</td>
                <td className="px-6 py-4">{new Date(student.created_at).toLocaleDateString()}</td>
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
    </div>
  );
}
