import React, { useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/UI/Button';
import { Logo } from '../../components/UI/Logo';
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  MoreHorizontal,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  TrendingUp,
  ClipboardList,
  CreditCard,
  FileText,
  BadgeHelp,
  Download
} from 'lucide-react';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import { IDCard } from '../../components/Student/IDCard';

export default function StudentDashboard() {
  const { studentData: initialData, user } = useSelector((state) => state.auth);
  const [studentData, setStudentData] = React.useState(initialData);
  const [loading, setLoading] = React.useState(true);
  const [downloadingCard, setDownloadingCard] = React.useState(false);
  const idCardRef = React.useRef(null);

  const handleDownloadIdCard = async () => {
    if (!idCardRef.current) return;
    try {
      setDownloadingCard(true);
      const canvas = await html2canvas(idCardRef.current, {
        scale: 2, // High resolution
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
      link.download = `${studentData.full_name || 'Student'}_ID_Card.png`;
      link.click();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Fail', text: `Could not generate card: ${err.message || err}` });
    } finally {
      setDownloadingCard(false);
    }
  };

  const refreshStatus = async () => {
    try {
      let admission = null;
      let cnicToUse = user?.username?.trim();
      
      if (user?.admission_id) {
        const { data } = await supabase
          .from('admissions')
          .select('*')
          .eq('id', user.admission_id)
          .single();
        admission = data;
        if (admission) cnicToUse = admission.cnic;
      } 
      
      if (!admission && cnicToUse) {
        const { data: records } = await supabase
          .from('admissions')
          .select('*')
          .eq('cnic', cnicToUse);
          
        if (records && records.length > 0) {
          admission = records.sort((a, b) => {
            const weights = { accepted: 3, rejected: 2, pending: 1 };
            return (weights[b.status] || 0) - (weights[a.status] || 0);
          })[0];
        }
      }

      // Fetch roll number regardless of admission record existence
      const { data: student } = await supabase
        .from('students')
        .select('roll_number')
        .eq('cnic', cnicToUse)
        .maybeSingle();

      if (admission) {
        setStudentData({ ...admission, roll_number: student?.roll_number });
      } else if (student?.roll_number) {
        // Fallback for students added via Excel but no admission form filled
        setStudentData({ 
          status: 'accepted', 
          roll_number: student.roll_number, 
          cnic: cnicToUse,
          full_name: user?.full_name || 'Student',
          course: 'Course details missing', // Or fetch from somewhere if possible
          campus: 'Campus details missing'
        });
      } else {
        setStudentData(null);
      }
    } catch (err) {
      console.error("Failed to refresh status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStatus();

    // Subscribe to changes
    const filter = user?.admission_id 
      ? `id=eq.${user.admission_id}` 
      : `cnic=eq.${user?.username?.trim()}`;

    const channel = supabase
      .channel(`admission-status-${user?.admission_id || user?.username}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'admissions',
          filter: filter
        },
        () => {
          refreshStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  useEffect(() => {
    if (studentData?.status === 'rejected') {
      Swal.fire({
        title: 'Application Rejected',
        text: 'Sorry, your application has been rejected. Better luck next time!',
        icon: 'error',
        confirmButtonText: 'Try Next Time',
        confirmButtonColor: '#d33',
        allowOutsideClick: false
      });
    }
  }, [studentData]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-gray-400 font-bold animate-pulse">Checking status...</div>;
  if (!studentData) return <div className="text-center py-20">No application data found.</div>;

  if (studentData.status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 animate-pulse">
           <Clock size={48} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Application Pending</h2>
          <p className="text-gray-500 max-w-md mx-auto font-medium">
            Your application is currently being reviewed by our administration. Please check back later.
          </p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-sm w-full">
           <div className="space-y-3 text-left">
              <div className="flex justify-between text-sm">
                 <span className="text-gray-400 font-bold">Course:</span>
                 <span className="text-gray-900 font-black">{studentData.course}</span>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="text-gray-400 font-bold">Campus:</span>
                 <span className="text-gray-800 font-black uppercase tracking-wider text-[10px]">{studentData.campus}</span>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="text-gray-400 font-bold">Applied on:</span>
                 <span className="text-gray-900 font-black">{new Date(studentData.created_at).toLocaleDateString()}</span>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (studentData.status === 'rejected') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500">
           <XCircle size={48} />
        </div>
        <div>
          <h1 className="text-6xl font-black text-red-600 mb-4">FAIL</h1>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Application Rejected</h2>
          <p className="text-gray-500 max-w-md mx-auto font-medium">
            We regret to inform you that your application could not be accepted at this time.
          </p>
        </div>
        <Button onClick={() => window.location.href = '/registration'} variant="danger" size="lg" className="rounded-2xl px-10 font-bold">
           Try Next Time
        </Button>
      </div>
    );
  }

  // Accepted View (Based on the image)
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs md:text-sm font-medium text-gray-400">
         <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
            <LayoutDashboard size={16} />
         </div>
         <span className="text-gray-500 font-bold">Home</span>
         <ChevronRight size={14} />
         <span className="text-brand-600 font-extrabold">{studentData.course}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats and Active Course */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-4xl font-black text-gray-900">0/0</p>
                   <p className="text-gray-400 font-bold text-sm tracking-wide mt-1 uppercase">Attendance</p>
                </div>
                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                   <Clock size={28} />
                </div>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-4xl font-black text-gray-900">0/0</p>
                   <p className="text-gray-400 font-bold text-sm tracking-wide mt-1 uppercase">Assignment</p>
                </div>
                <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center">
                   <GraduationCap size={28} />
                </div>
             </div>
          </div>

          {/* Active Course Card */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 flex items-center space-x-2 px-2">
               <span>Active Course</span>
            </h3>
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col p-8 md:p-12 relative">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">{studentData.course || 'Course Not Assigned'}</h2>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {studentData.id ? (
                      <span className="bg-brand-50 text-brand-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-brand-100">
                        Admission Done
                      </span>
                    ) : (
                      <button 
                        onClick={() => window.location.href = '/registration'}
                        className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-amber-200 animate-pulse"
                      >
                        Complete Profile
                      </button>
                    )}
                    <button 
                      onClick={handleDownloadIdCard}
                      disabled={downloadingCard || !studentData.course}
                      className="flex items-center space-x-1.5 bg-brand-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <Download size={14} />
                      <span>{downloadingCard ? 'Generating...' : 'Download ID Card'}</span>
                    </button>
                  </div>
               </div>

               {/* Hidden ID Card for Canvas Generation */}
               <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
                 <IDCard ref={idCardRef} studentData={studentData} />
               </div>

               <div className="mb-4"></div>


               <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-end">
                     <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Progress</span>
                     <span className="text-sm font-black text-gray-900 italic">0%</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 rounded-full shadow-lg shadow-emerald-100" style={{ width: '0%' }}></div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-gray-50 pt-10">
                  <div className="flex items-center space-x-4">
                     <div className="text-indigo-400 bg-indigo-50 p-3 rounded-2xl">
                        <TrendingUp size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Batch</p>
                        <p className="text-sm font-black text-gray-800">19</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-4">
                     <div className="text-emerald-400 bg-emerald-50 p-3 rounded-2xl">
                        <CreditCard size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Roll</p>
                        <p className="text-sm font-black text-gray-800">{studentData.roll_number || '385783'}</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-4">
                     <div className="text-amber-400 bg-amber-50 p-3 rounded-2xl">
                        <MapPin size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Campus</p>
                        <p className="text-sm font-black text-gray-800 uppercase text-[11px] leading-tight">{studentData.campus}</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-4">
                     <div className="text-blue-400 bg-blue-50 p-3 rounded-2xl">
                        <MapPin size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">City</p>
                        <p className="text-sm font-black text-gray-800 uppercase">{studentData.city || 'Karachi'}</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-xl font-black text-gray-900 px-2">Fee</h3>
             <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                      <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl">
                         <CreditCard size={24} />
                      </div>
                      <div>
                         <p className="text-lg font-black text-gray-900">May 2024</p>
                         <p className="text-sm font-bold text-gray-400">Monthly Tuition Fee</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xl font-black text-gray-900">Rs. 1,000</p>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">Paid</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Schedule and Quizzes */}
        <div className="space-y-8">
           <div className="hidden">
              {/* Class Schedule Removed */}
           </div>

           {/* Tabs Component */}
           <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-3 flex flex-col min-h-[400px]">
              <div className="bg-gray-50/50 p-1.5 rounded-[1.8rem] flex mb-8">
                 <button className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Assignments</button>
                 <button className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest bg-white text-gray-900 shadow-sm rounded-2xl">Quizzes</button>
                 <button className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Events</button>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 space-y-6">
                 <div className="w-20 h-20 bg-indigo-50/50 text-indigo-200 rounded-3xl flex items-center justify-center transform rotate-12">
                    <ClipboardList size={40} />
                 </div>
                 <h4 className="text-xl font-black text-gray-300 italic tracking-tight">No upcoming quizzes</h4>
                 <p className="text-xs font-bold text-gray-400 max-w-[180px] leading-relaxed">We'll notify you when a new quiz is published</p>
              </div>

              <div className="mt-auto p-4 border-t border-gray-50">
                 <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-colors">View All Activities</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
