import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../config/supabase';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, cnic, roll_number, password, isStudent = true }, { rejectWithValue }) => {
    try {
      if (isStudent) {
        // Authenticate student: Check if pre-added in students table
        const { data: student, error: studentErr } = await supabase
          .from('students')
          .select('*')
          .eq('cnic', cnic)
          .eq('roll_number', roll_number)
          .single();
          
        if (studentErr || !student) throw new Error('Student record not found. Please contact admin.');
        
        return { user: { username: student.cnic }, role: 'student', studentData: student };
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
