import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Logo } from '../components/UI/Logo';
import { MapPin, User, GraduationCap, Upload, ChevronDown } from 'lucide-react';
import Footer from '../components/Layout/Footer';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import { IDCard } from '../components/Student/IDCard';
import { Download, Search, Settings } from 'lucide-react';

import { supabase } from '../config/supabase';

import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../store/slices/courseSlice';

export default function AdmissionForm() {
  const dispatch = useDispatch();
  const { items: courses } = useSelector(state => state.courses);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [activeTab, setActiveTab] = React.useState('registration');
  const [uploading, setUploading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);

  // Search States
  const [searchCnic, setSearchCnic] = React.useState('');
  const [searchResult, setSearchResult] = React.useState(null);
  const [searching, setSearching] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const idCardRef = React.useRef(null);

  React.useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Filter courses that are currently open
  const openCourses = courses.filter(course => course.status === 'open');

  const onSubmit = async (data) => {
    // Final check for ID number length (should be 13)
    const cleanIdNumber = data.idNumber.toString().replace(/\D/g, '');
    const cleanFatherIdNumber = data.fatherIdNumber.toString().replace(/\D/g, '');

    if (cleanIdNumber.length < 13) {
      Swal.fire({
        title: 'Invalid ID!',
        text: 'Please use a real 13-digit ID number (digits only).',
        icon: 'warning',
        confirmButtonColor: '#1273b0'
      });
      return;
    }
    try {
      setUploading(true);

      // Check if already registered (pending OR accepted)
      const { data: existingRecord } = await supabase
        .from('admissions')
        .select('course, status')
        .eq('cnic', cleanIdNumber)
        .in('status', ['pending', 'accepted'])
        .maybeSingle();

      if (existingRecord) {
        const msg = existingRecord.status === 'accepted' 
          ? `You are already enrolled in "${existingRecord.course}".`
          : `You already have a pending application for "${existingRecord.course}". Please wait for admin approval.`;
          
        Swal.fire({
          title: existingRecord.status === 'accepted' ? 'Already Enrolled!' : 'Application Exists!',
          text: msg,
          icon: 'info',
          confirmButtonColor: '#1273b0'
        });
        setUploading(false);
        return;
      }

      let imageUrl = '';

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        let { error: uploadError } = await supabase.storage
          .from('admissions')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('admissions')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      // Add student data to database
      const { error: dbError } = await supabase
        .from('admissions')
        .insert([{
          full_name: data.fullName.trim(),
          father_name: data.fatherName.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          dob: data.dob,
          cnic: cleanIdNumber,
          father_cnic: cleanFatherIdNumber,
          gender: data.gender,
          city: data.city,
          country: data.country,
          course: data.course,
          campus: data.campus,
          address: data.address.trim(),
          proficiency: data.proficiency,
          qualification: data.qualification,
          has_laptop: data.hasLaptop === 'yes',
          image_url: imageUrl,
          status: 'pending'
        }]);

      if (dbError) throw dbError;

      Swal.fire({
        title: 'Success!',
        text: 'Your application has been submitted successfully.',
        icon: 'success',
        confirmButtonColor: '#1273b0',
        borderRadius: '20px'
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong: ' + error.message,
        icon: 'error',
        confirmButtonColor: '#1273b0'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleIdCardSearch = async (e) => {
    e.preventDefault();
    if (!searchCnic) return;
    
    setSearching(true);
    setSearchResult(null);
    const cleanCnic = searchCnic.toString().replace(/\D/g, '');
    
    try {
      const { data: admission, error } = await supabase
        .from('admissions')
        .select('*')
        .eq('cnic', cleanCnic)
        .eq('status', 'accepted')
        .single();
        
      if (error || !admission) {
        Swal.fire({
          title: 'Not Found',
          text: 'No accepted application found for this CNIC. Please make sure you are approved.',
          icon: 'info',
          confirmButtonColor: '#1273b0'
        });
        return;
      }

      const { data: student } = await supabase
        .from('students')
        .select('roll_number')
        .eq('cnic', cleanCnic)
        .maybeSingle();

      setSearchResult({ ...admission, roll_number: student?.roll_number });
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleDownloadCard = async () => {
    if (!idCardRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(idCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        onclone: (doc) => {
          const elements = doc.querySelectorAll('*');
          elements.forEach(el => {
            const styles = window.getComputedStyle(el);
            if (styles.backgroundColor?.includes('oklch')) el.style.backgroundColor = '#ffffff';
            if (styles.color?.includes('oklch')) el.style.color = '#000000';
            if (styles.borderColor?.includes('oklch')) el.style.borderColor = '#d1d5db';
          });
        }
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${searchResult.full_name}_ID_Card.png`;
      link.click();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Fail', text: `Could not generate card: ${err.message || err}` });
    } finally {
      setDownloading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    alert('Result search will be implemented soon!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-700 py-12 md:py-20 px-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 L100 0 L100 100 Z" fill="white" />
           </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-2 text-xs md:text-sm font-medium opacity-80 mb-4 tracking-widest uppercase">
            <GraduationCap size={16} />
            <span>Enroll Now</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Registration Form</h1>
          <p className="text-sm md:text-lg text-blue-50/80 max-w-2xl mx-auto">
            Start your journey towards excellence. Fill out the form to apply for our courses.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 -mt-10 mb-20 relative z-20">
        {/* Tab Interface */}
        <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-wrap gap-2 mb-10 border border-gray-100">
           <button 
            onClick={() => setActiveTab('registration')}
            className={`flex-1 min-w-[120px] py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'registration' 
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-100' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
           >
              <User size={18} />
              <span>Registration Form</span>
           </button>
           <button 
            onClick={() => setActiveTab('idcard')}
            className={`flex-1 min-w-[120px] py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'idcard' 
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-100' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
           >
              <div className="border-2 border-current rounded p-0.5">
                <div className="w-2 h-2 bg-current"></div>
              </div>
              <span>Download ID Card</span>
           </button>
           <button 
            onClick={() => setActiveTab('result')}
            className={`flex-1 min-w-[120px] py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'result' 
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-100' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
           >
              <div className="border-2 border-current rounded p-0.5">
                <div className="w-2 h-2 bg-current"></div>
              </div>
              <span>Result</span>
           </button>
        </div>

        {activeTab === 'registration' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {/* Section 1: Location & Course */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center space-x-3 text-brand-600 border-b border-gray-100 pb-4">
                <MapPin size={24} />
                <h2 className="text-xl font-bold">Location & Course Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Select Country*</label>
                  <div className="relative">
                    <select {...register('country', { required: true })} className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 appearance-none focus:ring-2 focus:ring-brand-500 outline-none transition-all text-gray-600 font-medium">
                      <option value="">Select country</option>
                      <option value="pakistan">Pakistan</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                  {errors.country && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Select class preference*</label>
                  <div className="relative">
                    <select {...register('class_pref', { required: true })} className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 appearance-none focus:ring-2 focus:ring-brand-500 outline-none transition-all text-gray-600 font-medium">
                      <option value="">Select class preference</option>
                      <option value="on-campus">On Campus</option>
                      <option value="online">Online</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                  {errors.class_pref && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Select Gender*</label>
                  <div className="relative">
                    <select {...register('gender', { required: true })} className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 appearance-none focus:ring-2 focus:ring-brand-500 outline-none transition-all text-gray-600 font-medium">
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                  {errors.gender && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Select City*</label>
                  <div className="relative">
                    <select {...register('city', { required: true })} className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 appearance-none focus:ring-2 focus:ring-brand-500 outline-none transition-all text-gray-600 font-medium">
                      <option value="">Select city</option>
                      <option value="karachi">Karachi</option>
                      <option value="lahore">Lahore</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                  {errors.city && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Select Course*</label>
                  <div className="relative">
                    <select {...register('course', { required: true })} className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 appearance-none focus:ring-2 focus:ring-brand-500 outline-none transition-all text-gray-600 font-medium">
                      <option value="">Select course</option>
                      {openCourses.length > 0 ? (
                        openCourses.map(course => (
                          <option key={course.id} value={course.name}>{course.name}</option>
                        ))
                      ) : (
                        <option disabled>No courses open currently</option>
                      )}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                  {errors.course && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Select Campus*</label>
                  <div className="relative">
                    <select {...register('campus', { required: true })} className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 appearance-none focus:ring-2 focus:ring-brand-500 outline-none transition-all text-gray-600 font-medium">
                      <option value="">Select campus</option>
                      <option value="aliabad">Aliabad Campus</option>
                      <option value="gulshan">Gulshan Campus</option>
                      <option value="paposh">Paposh Campus</option>
                      <option value="bahadurabad">Bahadurabad Campus</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                  {errors.campus && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
                </div>
              </div>
            </div>

            {/* Section 2: Personal Information */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 space-y-10">
              <div className="flex items-center space-x-3 text-brand-600 border-b border-gray-100 pb-4">
                <User size={24} />
                <h2 className="text-xl font-bold">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Full Name*</label>
                    <input {...register('fullName', { required: true })} className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="Enter your full name" />
                    {errors.fullName && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Father Name*</label>
                    <input {...register('fatherName', { required: true })} className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="Enter father's name" />
                    {errors.fatherName && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Date of Birth*</label>
                    <input type="date" {...register('dob', { required: true })} className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 focus:ring-2 focus:ring-brand-500 outline-none transition-all text-gray-500" />
                    {errors.dob && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email*</label>
                    <input type="email" {...register('email', { required: true })} className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="your.email@example.com" />
                    {errors.email && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Phone*</label>
                    <input {...register('phone', { required: true })} className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="Enter phone number" />
                    {errors.phone && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Father's Phone*</label>
                    <input {...register('fatherPhone', { required: true })} className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="Enter phone number" />
                    {errors.fatherPhone && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">CNIC Number (13 Digits)*</label>
                    <input 
                      type="number" 
                      {...register('idNumber', { 
                        required: true, 
                        minLength: { value: 13, message: "Use real id number" },
                        maxLength: { value: 13, message: "Use real id number" }
                      })} 
                      className={`w-full h-14 bg-gray-50 border ${errors.idNumber ? 'border-red-500' : 'border-gray-200'} rounded-2xl px-5 focus:ring-2 focus:ring-brand-500 outline-none transition-all`} 
                      placeholder="e.g. 4220112345678" 
                    />
                    {errors.idNumber && <span className="text-xs text-red-500 font-bold ml-1">{errors.idNumber.message || 'This field is required'}</span>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Father's CNIC (13 Digits)*</label>
                    <input 
                      type="number" 
                      {...register('fatherIdNumber', { 
                        required: true, 
                        minLength: { value: 13, message: "Use real id number" },
                        maxLength: { value: 13, message: "Use real id number" }
                      })} 
                      className={`w-full h-14 bg-gray-50 border ${errors.fatherIdNumber ? 'border-red-500' : 'border-gray-200'} rounded-2xl px-5 focus:ring-2 focus:ring-brand-500 outline-none transition-all`} 
                      placeholder="e.g. 4220112345678" 
                    />
                    {errors.fatherIdNumber && <span className="text-xs text-red-500 font-bold ml-1">{errors.fatherIdNumber.message || 'This field is required'}</span>}
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700">Address* (0-220 characters)</label>
                 <textarea {...register('address', { required: true, minLength: 10 })} rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-[2rem] p-6 focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="Enter your complete address (minimum 10 characters)"></textarea>
                 {errors.address && <span className="text-xs text-red-500 font-bold ml-1">This field is required (min 10 chars)</span>}
              </div>
            </div>

            {/* Section 3: Education */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 space-y-10">
              <div className="flex items-center space-x-3 text-brand-600 border-b border-gray-100 pb-4">
                <GraduationCap size={24} />
                <h2 className="text-xl font-bold">Education & Technical Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Computer Proficiency*</label>
                  <div className="relative">
                    <select {...register('proficiency', { required: true })} className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 appearance-none focus:ring-2 focus:ring-brand-500 outline-none transition-all text-gray-600 font-medium">
                      <option value="">Select your computer proficiency</option>
                      <option value="beginner">Beginner</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                  {errors.proficiency && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Last Qualification*</label>
                  <div className="relative">
                    <select {...register('qualification', { required: true })} className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 appearance-none focus:ring-2 focus:ring-brand-500 outline-none transition-all text-gray-600 font-medium">
                      <option value="">Last qualification</option>
                      <option value="matric">Matric</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="graduation">Graduation</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                  {errors.qualification && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700">Where did you hear about us?*</label>
                 <div className="relative">
                    <select {...register('source', { required: true })} className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 appearance-none focus:ring-2 focus:ring-brand-500 outline-none transition-all text-gray-600 font-medium">
                      <option value="">Where did you hear about us?</option>
                      <option value="facebook">Facebook</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                  {errors.source && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
              </div>

              <div className="space-y-4">
                 <label className="text-sm font-bold text-gray-700 block">Do you have a Laptop?*</label>
                 <div className="flex space-x-12">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                       <input type="radio" value="yes" {...register('hasLaptop', { required: true })} className="w-5 h-5 text-brand-600 focus:ring-brand-500 border-gray-300" />
                       <span className="text-gray-600 font-medium group-hover:text-brand-600 transition-colors">Yes</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                       <input type="radio" value="no" {...register('hasLaptop', { required: true })} className="w-5 h-5 text-brand-600 focus:ring-brand-500 border-gray-300" />
                       <span className="text-gray-600 font-medium group-hover:text-brand-600 transition-colors">No</span>
                    </label>
                 </div>
                 {errors.hasLaptop && <span className="text-xs text-red-500 font-bold ml-1">This field is required</span>}
              </div>
            </div>

            {/* Section 4: Picture Upload */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center space-x-3 text-brand-600 border-b border-gray-100 pb-4">
                <Upload size={24} />
                <h2 className="text-xl font-bold">Upload Picture</h2>
              </div>
              
              <div className="relative border-4 border-dashed border-gray-100 rounded-[3rem] p-10 md:p-16 flex flex-col items-center justify-center space-y-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                 <input 
                   type="file" 
                   accept="image/*" 
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" 
                   onChange={handleFileChange}
                 />
                 <div className="bg-brand-50 p-6 rounded-full text-brand-600 group-hover:scale-110 transition-transform relative z-20">
                    <Upload size={40} />
                 </div>
                 {selectedFile ? (
                   <div className="text-center z-20">
                      <p className="text-brand-600 font-bold mb-2">Selected: {selectedFile.name}</p>
                      <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl mx-auto" />
                   </div>
                 ) : (
                   <div className="z-20 flex flex-col items-center space-y-6">
                      <button type="button" className="bg-brand-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:bg-brand-700 transition-colors pointer-events-none">
                         + Upload Picture
                      </button>
                      <div className="text-center space-y-1">
                         <p className="text-sm font-bold text-gray-500">- With white or blue background</p>
                         <p className="text-sm font-bold text-gray-500">- File size must be less than 1MB</p>
                         <p className="text-sm font-bold text-gray-500">- File type: jpg, jpeg, png</p>
                         <p className="text-xs text-gray-400 mt-2 font-medium">Upload your recent passport size picture</p>
                         <p className="text-xs text-gray-400 font-medium">Your Face should be clearly visible without any Glasses</p>
                      </div>
                   </div>
                 )}
              </div>
            </div>

            <div className="flex justify-center pb-12">
               <Button type="submit" disabled={uploading} size="lg" className="h-16 px-16 rounded-2xl text-xl font-black shadow-2xl shadow-brand-200 hover:scale-105 active:scale-95 transition-all">
                 {uploading ? 'Submitting...' : 'Submit Application'}
               </Button>
            </div>
          </form>
        )}

        {activeTab === 'idcard' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-xl border border-gray-100 text-center space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-gray-900">Download ID Card</h2>
              <p className="text-gray-500 font-medium text-lg">Enter the CNIC you provided during form submission.</p>
              <p className="text-red-500 text-sm font-bold flex items-center justify-center space-x-2">
                <span className="border border-red-500 rounded px-1 text-[10px]">!</span>
                <span>Enter 13 digit CNIC number.</span>
              </p>
            </div>
            
            <form onSubmit={handleIdCardSearch} className="max-w-2xl mx-auto space-y-8">
               <div className="text-left space-y-2">
                  <label className="text-sm font-bold text-gray-700">CNIC Number*</label>
                  <input 
                    type="text" 
                    className="w-full h-16 bg-gray-50 border border-gray-200 rounded-2xl px-6 text-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder:text-gray-300" 
                    placeholder="4220112345678" 
                    required 
                    value={searchCnic}
                    onChange={(e) => setSearchCnic(e.target.value)}
                  />
               </div>
               <Button type="submit" disabled={searching} className="w-full h-16 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center space-x-3 shadow-xl shadow-brand-100 hover:scale-[1.02] transition-all">
                  <Search size={24} strokeWidth={3} />
                  <span>{searching ? 'Searching...' : 'Search'}</span>
               </Button>
            </form>

            {searchResult && (
              <div className="mt-12 p-8 bg-brand-50 rounded-[2rem] border border-brand-100 animate-in fade-in slide-in-from-bottom-5">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-left">
                       <h3 className="text-2xl font-black text-gray-900">{searchResult.full_name}</h3>
                       <p className="text-brand-600 font-bold">{searchResult.course}</p>
                       <p className="text-xs text-gray-400 font-mono mt-1">Roll: {searchResult.roll_number || 'Pending'}</p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-4">
                       <Button onClick={handleDownloadCard} disabled={downloading} className="h-14 px-10 rounded-xl bg-emerald-600 hover:bg-emerald-700">
                          <Download size={20} className="mr-2" />
                          {downloading ? 'Downloading...' : 'Download Card'}
                       </Button>
                       
                       {/* Hidden Render target */}
                       <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
                          <IDCard ref={idCardRef} studentData={searchResult} />
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'result' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-xl border border-gray-100 text-center space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-gray-900">Check Your Result</h2>
              <p className="text-gray-500 font-medium text-lg">Enter your roll number to view your results</p>
            </div>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto space-y-8">
               <div className="text-left space-y-2">
                  <label className="text-sm font-bold text-gray-700">Roll Number*</label>
                  <input type="text" className="w-full h-16 bg-gray-50 border border-gray-200 rounded-2xl px-6 text-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder:text-gray-300 font-bold uppercase" placeholder="ENTER YOUR ROLL NUMBER" required />
               </div>
               <Button type="submit" className="w-full h-16 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center space-x-3 shadow-xl shadow-brand-100 hover:scale-[1.02] transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  <span>Search Result</span>
               </Button>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
