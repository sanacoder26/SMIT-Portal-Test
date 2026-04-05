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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
            <BookOpen className="w-7 h-7" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isSignup ? 'Student Registration' : 'Sign in to SMIT Portal'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          {!isSignup && (
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button 
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'student' ? 'bg-white shadow-sm text-brand-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setRole('student')}
              >Student</button>
              <button 
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'admin' ? 'bg-white shadow-sm text-brand-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setRole('admin')}
              >Admin</button>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {role === 'student' ? (
              <>
                <Input label="CNIC Number" placeholder="42xxx-xxxxxxx-x" {...register('cnic', { required: 'CNIC is required' })} error={errors.cnic?.message} />
                <Input label="Roll Number" placeholder="WM-12345" {...register('roll_number', { required: 'Roll Number is required' })} error={errors.roll_number?.message} />
              </>
            ) : (
              <>
                <Input label="Admin Username" placeholder="Username" {...register('username', { required: 'Username is required' })} error={errors.username?.message} />
                <Input label="Password" type="password" placeholder="••••••••" {...register('password', { required: 'Password is required' })} error={errors.password?.message} />
              </>
            )}

            {authError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{authError}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : isSignup ? 'Register' : 'Sign in'}
            </Button>
          </form>

          {role === 'student' && (
            <div className="mt-6 text-center text-sm text-gray-600">
              {isSignup ? 'Already registered?' : "New student?"}
              <button onClick={() => setIsSignup(!isSignup)} className="ml-1 text-brand-600 font-medium">{isSignup ? 'Sign in' : 'Register now'}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
