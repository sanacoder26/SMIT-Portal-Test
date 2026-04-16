import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../config/supabase';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, cnic, phone, password, isStudent = true }, { rejectWithValue }) => {
    try {
      if (isStudent) {
        // Authenticate student: Check users table for credentials
        const { data: userRecord, error: authErr } = await supabase
          .from('users')
          .select('*')
          .eq('username', cnic.trim())
          .eq('password', password)
          .eq('role', 'student')
          .single();

        if (authErr || !userRecord) throw new Error('Invalid CNIC or Password');
        
        // Fetch their admission data to populate studentData
        const { data: admission, error: admissionErr } = await supabase
          .from('admissions')
          .select('*')
          .eq('cnic', cnic.trim())
          .maybeSingle();

        let rollNumber = null;
        // Fetch roll number from students table (authorized list)
        const { data: student } = await supabase
          .from('students')
          .select('roll_number')
          .eq('cnic', cnic.trim())
          .maybeSingle();
        rollNumber = student?.roll_number;

        return { 
          user: { 
            username: userRecord.username, 
            full_name: admission ? admission.full_name : 'Student',
            admission_id: admission ? admission.id : null 
          }, 
          role: 'student', 
          studentData: admission ? { ...admission, roll_number: rollNumber } : (rollNumber ? { status: 'accepted', roll_number: rollNumber, cnic: cnic.trim() } : null)
        };
      } else {
        // Correctly point to the 'users' table as defined in database-schema.sql
        const { data: admin, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .eq('password', password)
          .eq('role', 'admin') // Only allow users with the 'admin' role
          .single();
          
        if (error || !admin) throw new Error('Invalid admin credentials');
        return { user: admin, role: 'admin' };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    role: null, // 'student' | 'admin'
    studentData: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.studentData = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.studentData = action.payload.studentData || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
