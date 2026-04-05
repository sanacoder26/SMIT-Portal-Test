import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../store/slices/courseSlice';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { Input } from '../../components/UI/Input';
import { supabase } from '../../config/supabase';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function StudentCourses() {
  const dispatch = useDispatch();
  const { items: courses, loading } = useSelector(state => state.courses);
  const { studentData } = useSelector(state => state.auth);
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyStatus, setApplyStatus] = useState(null);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleApplyClick = (course) => {
    setSelectedCourse(course);
    setApplyModalOpen(true);
    setApplyStatus(null);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    try {
      setApplyStatus({ type: 'loading', msg: 'Submitting...' });
      
      const { error } = await supabase.from('applications').insert([{
        student_id: studentData.id,
        course_id: selectedCourse.id,
      }]);
      
      if (error) throw error;
      setApplyStatus({ type: 'success', msg: 'Application submitted successfully!' });
      setTimeout(() => { setApplyModalOpen(false); }, 1500);
    } catch (err) {
      setApplyStatus({ type: 'error', msg: err.message || 'Failed to submit' });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Available Courses</h1>
        <p className="text-gray-500 mt-1">Explore and enroll in the latest SMIT offerings.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
                {course.status === 'open' ? (
                  <CheckCircle2 className="text-green-500 w-6 h-6" />
                ) : (
                  <XCircle className="text-red-500 w-6 h-6" />
                )}
              </div>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${course.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {course.status}
                </span>
                <Button 
                  onClick={() => handleApplyClick(course)} 
                  disabled={course.status !== 'open'}
                  variant={course.status === 'open' ? 'primary' : 'secondary'}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} title={`Apply for ${selectedCourse?.name}`}>
        <form onSubmit={submitApplication} className="space-y-4">
          <Input label="Roll Number" value={studentData?.roll_number || ''} readOnly />
          <Input label="CNIC" value={studentData?.cnic || ''} readOnly />
          
          {applyStatus && (
            <div className={`p-3 rounded-lg text-sm ${applyStatus.type === 'error' ? 'bg-red-50 text-red-600' : applyStatus.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
              {applyStatus.msg}
            </div>
          )}

          <div className="pt-4 flex justify-end space-x-3">
            <Button type="button" variant="ghost" onClick={() => setApplyModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={applyStatus?.type === 'loading' || applyStatus?.type === 'success'}>
              Confirm Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
