import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../store/slices/courseSlice';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { Input } from '../components/UI/Input';
import { useNavigate } from 'react-router-dom';

export default function PublicCourses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: courses, loading } = useSelector(state => state.courses);
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleApplyClick = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  return (
    <div className="flex-1 p-6 md:p-10 lg:p-16 bg-gradient-to-br from-green-50/50 via-white to-blue-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-600 mb-3 ml-1">COURSES</div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">Available course admissions</h1>
            <p className="text-gray-500 text-base md:text-lg lg:text-xl max-w-2xl lg:text-right leading-relaxed font-medium">
              Join SMIT to transform your career with world-class IT education. Apply now and start your journey.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 xl:gap-12">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgb(0,0,0,0.03)] border border-gray-100 p-10 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col group relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">COURSE</div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${course.status === 'open' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {course.status}
                  </span>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors duration-300 mb-6">{course.name}</h3>
                <p className="text-gray-500 leading-relaxed text-base md:text-lg flex-1">
                  {course.description || `Master the skills of ${course.name} with our hands-on training program. Gain industry-standard knowledge and practical experience.`}
                </p>
                
                <div className="mt-12">
                  <Button 
                    onClick={() => handleApplyClick(course)} 
                    disabled={course.status !== 'open'}
                    className={`h-14 px-10 rounded-[1.25rem] font-bold text-base transition-all duration-300 shadow-xl ${
                      course.status === 'open' 
                        ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:scale-105 hover:shadow-blue-200 active:scale-95' 
                        : 'bg-gradient-to-r from-blue-100/50 to-blue-200/50 text-blue-400/80 cursor-not-allowed shadow-none'
                    }`}
                  >
                    {course.status === 'open' ? 'Apply Now' : 'Admissions Closed'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Admission Application Form"
        description="Please fill out this complete form to apply."
      >
        <form onSubmit={(e) => { e.preventDefault(); window.alert('successfully'); setModalOpen(false); }} className="space-y-4 max-h-[70vh] overflow-y-auto px-2 pb-4 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-brand-500">Select country</label>
              <select required className="flex h-11 w-full rounded-md border border-accent-500 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 text-gray-400">
                <option value="">Select country</option>
                <option value="pakistan">Pakistan</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-brand-500">Select city</label>
              <select required className="flex h-11 w-full rounded-md border border-accent-500 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 text-gray-400">
                <option value="">Select city</option>
                <option value="karachi">Karachi</option>
                <option value="lahore">Lahore</option>
                <option value="islamabad">Islamabad</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-brand-500">Select course or event</label>
              <select required className="flex h-11 w-full rounded-md border border-accent-500 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 text-gray-400">
                <option value="">Select course or event</option>
                <option value="web">Web & App Development</option>
                <option value="graphic">Graphic Design</option>
                <option value="digital">Digital Marketing</option>
                <option value="python">Python Programming</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-brand-500">Select your computer proficiency</label>
              <select required className="flex h-11 w-full rounded-md border border-accent-500 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 text-gray-400">
                <option value="">Select your computer proficiency</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label={<span className="text-[13px] font-bold text-brand-500">Full name</span>} placeholder="Full name" required className="border-accent-500 focus-visible:ring-accent-500 placeholder-gray-300 rounded-md" />
            <Input label={<span className="text-[13px] font-bold text-brand-500">Father name</span>} placeholder="Father name" required className="border-accent-500 focus-visible:ring-accent-500 placeholder-gray-300 rounded-md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label={<span className="text-[13px] font-bold text-brand-500">Email</span>} type="email" placeholder="Email" required className="border-accent-500 focus-visible:ring-accent-500 placeholder-gray-300 rounded-md" />
            <Input label={<span className="text-[13px] font-bold text-brand-500">Phone</span>} placeholder="Phone" required className="border-accent-500 focus-visible:ring-accent-500 placeholder-gray-300 rounded-md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label={<span className="text-[13px] font-bold text-brand-500">CNIC</span>} placeholder="CNIC" required className="border-accent-500 focus-visible:ring-accent-500 placeholder-gray-300 rounded-md" />
            <Input label={<span className="text-[13px] font-bold text-brand-500">Father's CNIC (optional)</span>} placeholder="Father's CNIC (optional)" className="border-accent-500 focus-visible:ring-accent-500 placeholder-gray-300 rounded-md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label={<span className="text-[13px] font-bold text-brand-500">Date of birth</span>} type="date" required className="border-accent-500 focus-visible:ring-accent-500 text-gray-500 rounded-md" />
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-brand-500">Select gender</label>
              <select required className="flex h-11 w-full rounded-md border border-accent-500 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 text-gray-400">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 mt-2">
            <Button type="submit" className="flex-1 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 shadow-md text-white font-bold text-lg">Submit Form</Button>
            <Button type="button" variant="ghost" className="flex-1 h-12 rounded-xl border border-gray-300" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
