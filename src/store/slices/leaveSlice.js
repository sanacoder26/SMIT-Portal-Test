import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../config/supabase';

export const fetchLeaves = createAsyncThunk('leaves/fetchLeaves', async (studentId, { rejectWithValue }) => {
  try {
    let query = supabase.from('leaves').select(`*, students ( cnic, roll_number )`).order('created_at', { ascending: false });
    if (studentId) {
      query = query.eq('student_id', studentId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const submitLeave = createAsyncThunk('leaves/submitLeave', async (leaveData, { rejectWithValue }) => {
  try {
    const dataToInsert = { 
      ...leaveData, 
      status: leaveData.status?.toLowerCase() || 'pending'
    };
    const { data, error } = await supabase.from('leaves').insert([dataToInsert]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateLeaveStatus = createAsyncThunk('leaves/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.from('leaves').update({ status: status.toLowerCase() }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const leaveSlice = createSlice({
  name: 'leaves',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (state) => { state.loading = true; })
      .addCase(fetchLeaves.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchLeaves.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(submitLeave.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(l => l.id === action.payload.id);
        if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
      });
  },
});

export default leaveSlice.reducer;
