import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../config/supabase';
import * as xlsx from 'xlsx';

export const fetchStudents = createAsyncThunk('students/fetchStudents', async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addStudentsBulk = createAsyncThunk('students/addBulk', async (file, { rejectWithValue }) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target.result;
          const workbook = xlsx.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = xlsx.utils.sheet_to_json(worksheet);
          
          // Expected columns in Excel: cnic, roll_number
          const records = json.map(row => ({
            cnic: row.cnic?.toString(),
            roll_number: row.roll_number?.toString()
          })).filter(r => r.cnic && r.roll_number);

          const { data: insertedData, error } = await supabase
            .from('students')
            .upsert(records)
            .select();
            
          if (error) throw error;
          resolve(insertedData);
        } catch (err) {
          reject(err.message);
        }
      };
      reader.onerror = () => reject('Failed to read file');
      reader.readAsBinaryString(file);
    });
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const studentSlice = createSlice({
  name: 'students',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => { state.loading = true; })
      .addCase(fetchStudents.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchStudents.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addStudentsBulk.fulfilled, (state, action) => {
        // Just refetching or appending can be done here. We'll simply append or ignore since user will refetch.
      });
  },
});

export default studentSlice.reducer;
