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
    <div className="flex-1 -m-3 md:-m-6 lg:-m-8 p-3 md:p-6 lg:p-8 bg-gradient-to-br from-green-50/50 via-white to-blue-50/30 min-h-full">
      <div className="mb-12 lg:mb-16">
        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-600 mb-3 ml-1">COURSES</div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">Available course admissions</h1>
          <p className="text-gray-500 text-sm md:text-base lg:text-lg max-w-xl lg:text-right leading-relaxed font-medium">
            Browse active admissions, review course descriptions, and apply directly from the portal.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 xl:gap-10">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col group relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">COURSE</div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${course.status === 'open' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {course.status}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors duration-300">{course.name}</h3>
              <p className="mt-4 text-gray-500 leading-relaxed text-sm md:text-base flex-1">
                {course.description || `Comprehensive training program in ${course.name} designed for beginner to advanced levels. Project-based learning with expert mentors.`}
              </p>
              
              <div className="mt-10">
                <Button 
                  onClick={() => handleApplyClick(course)} 
                  disabled={course.status !== 'open'}
                  className={`w-32 h-12 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg ${
                    course.status === 'open' 
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:scale-105 hover:shadow-blue-200 active:scale-95' 
                      : 'bg-gradient-to-r from-blue-100/50 to-blue-200/50 text-blue-400/80 cursor-not-allowed shadow-none'
                  }`}
                >
                  {course.status === 'open' ? 'Apply' : 'Admissions Closed'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal 
        isOpen={applyModalOpen} 
        onClose={() => setApplyModalOpen(false)} 
        title={`Admission Form: ${selectedCourse?.name}`}
        description="Please fill out the details carefully for your enrollment request."
      >
        <form onSubmit={submitApplication} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Roll Number" value={studentData?.roll_number || ''} readOnly className="bg-gray-50" />
            <Input label="CNIC" value={studentData?.cnic || ''} readOnly className="bg-gray-50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="As per CNIC" required />
            <Input label="Father Name" placeholder="Father's Name" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Email Address" type="email" placeholder="example@gmail.com" required />
            <Input label="Phone Number" placeholder="03xx-xxxxxxx" required />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">City</label>
            <select className="flex h-11 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              <option>Karachi</option>
              <option>Hyderabad</option>
              <option>Islamabad</option>
              <option>Faisalabad</option>
            </select>
          </div>
          
          {applyStatus && (
            <div className={`p-4 rounded-xl text-sm flex items-center ${applyStatus.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
              {applyStatus.msg}
            </div>
          )}

          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-6">
            <Button type="button" variant="ghost" onClick={() => setApplyModalOpen(false)}>Cancel Application</Button>
            <Button type="submit" disabled={applyStatus?.type === 'loading' || applyStatus?.type === 'success'}>
              {applyStatus?.type === 'loading' ? 'Submitting...' : 'Submit Admission Request'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
