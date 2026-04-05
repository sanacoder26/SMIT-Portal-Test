import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm as useHookForm } from 'react-hook-form';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { loginUser } from '../../store/slices/authSlice';
import { supabase } from '../../config/supabase';
import { BookOpen } from 'lucide-react';

export default function Login() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'admin' ? 'admin' : 'student';
  const [role, setRole] = useState(defaultRole);
  const [isSignup, setIsSignup] = useState(false);
  const [authError, setAuthError] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);

  const { register, handleSubmit, formState: { errors } } = useHookForm();

  const onSubmit = async (data) => {
    setAuthError(null);
    if (isSignup && role === 'student') {
      try {
        // Step 1: Check if pre-added in students table
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('cnic', data.cnic)
          .eq('roll_number', data.roll_number)
          .single();
          
        if (studentError || !student) {
          setAuthError("You are not pre-registered. Please contact admin.");
          return;
        }

        // Step 2: Create a user entry
        const { error: signUpError } = await supabase.from('users').insert([{
          username: data.cnic,
          role: 'student'
        }]);

        if (signUpError) {
          setAuthError(signUpError.message || "Failed to register user record (maybe already exists).");
          return;
        }

        // Login as student
        await dispatch(loginUser({ 
          cnic: data.cnic, 
          roll_number: data.roll_number, 
          isStudent: true 
        })).unwrap();
        navigate('/student/courses');
      } catch (err) {
        setAuthError(err.message || 'Signup failed');
      }
    } else {
      // Login
      try {
        if (role === 'admin') {
          // Admin login (uses admins table in slice)
          await dispatch(loginUser({ 
            username: data.username, 
            password: data.password, 
            isStudent: false 
          })).unwrap();
          navigate('/admin');
        } else {
          // Student login
          await dispatch(loginUser({ 
            cnic: data.cnic, 
            roll_number: data.roll_number, 
            isStudent: true 
          })).unwrap();
          navigate('/student/courses');
        }
      } catch (err) {
        setAuthError(typeof err === 'string' ? err : 'Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        <div className="w-full max-w-[22rem] sm:max-w-md md:max-w-lg">
          <div className="flex justify-center flex-col items-center">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-100 mb-4 md:mb-6">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight px-2">
              {isSignup ? 'Student Registration' : 'Sign in to SMIT Portal'}
            </h2>
            <p className="mt-2 md:mt-3 text-center text-gray-500 text-sm md:text-base lg:text-lg px-4">
              {isSignup ? 'Join the community and start your journey' : 'Welcome back! Please enter your details'}
            </p>
          </div>
 
          <div className="mt-8 md:mt-10 bg-white py-8 md:py-10 px-4 sm:px-6 md:px-8 shadow-2xl shadow-gray-200/50 rounded-2xl md:rounded-3xl border border-gray-100">
          {!isSignup && (
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button 
                className={`flex-1 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-lg transition-all ${role === 'student' ? 'bg-white shadow-sm text-brand-700 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setRole('student')}
              >Student</button>
              <button 
                className={`flex-1 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-lg transition-all ${role === 'admin' ? 'bg-white shadow-sm text-brand-700 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setRole('admin')}
              >Admin</button>
            </div>
          )}
 
          <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {role === 'student' ? (
              <>
                <Input label="CNIC Number" placeholder="42xxx-xxxxxxx-x" {...register('cnic', { required: 'CNIC is required' })} error={errors.cnic?.message} />
                <Input label="Roll Number" placeholder="WM-12345" {...register('roll_number', { required: 'Roll Number is required' })} error={errors.roll_number?.message} />
              </>
            ) : (
              <>
                <Input label="Admin Email" placeholder="admin@gmail.com" {...register('username', { required: 'Email is required' })} error={errors.username?.message} />
                <Input label="Password" type="password" placeholder="••••••••" {...register('password', { required: 'Password is required' })} error={errors.password?.message} />
              </>
            )}
 
            {authError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{authError}</div>}
 
            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
              {loading ? 'Processing...' : isSignup ? 'Register' : 'Sign in'}
            </Button>
          </form>
 
          {role === 'student' && (
            <div className="mt-6 text-center text-sm text-gray-600">
              {isSignup ? 'Already registered?' : "New student?"}
              <button onClick={() => setIsSignup(!isSignup)} className="ml-1 text-brand-600 font-medium hover:underline">{isSignup ? 'Sign in' : 'Register now'}</button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
