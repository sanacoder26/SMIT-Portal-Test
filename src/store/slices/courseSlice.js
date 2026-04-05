import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../config/supabase';

// Fetch courses
export const fetchCourses = createAsyncThunk('courses/fetchCourses', async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Add course
export const addCourse = createAsyncThunk('courses/addCourse', async (courseData, { rejectWithValue }) => {
  try {
    // Schema uses lowercase 'open', so we ensure it's lowercase
    const dataToInsert = { 
      ...courseData, 
      status: courseData.status.toLowerCase() 
    };
    const { data, error } = await supabase.from('courses').insert([dataToInsert]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Update course
export const updateCourse = createAsyncThunk('courses/updateCourse', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const dataToUpdate = { 
      ...updates, 
      status: updates.status?.toLowerCase() 
    };
    const { data, error } = await supabase.from('courses').update(dataToUpdate).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.loading = true; })
      .addCase(fetchCourses.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchCourses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(addCourse.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export default courseSlice.reducer;
