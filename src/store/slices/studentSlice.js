import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../config/supabase';
import * as xlsx from 'xlsx';

export const fetchStudents = createAsyncThunk('students/fetchStudents', async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.from('admissions').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateStudentStatus = createAsyncThunk('students/updateStatus', async ({ id, status, studentData }, { dispatch, rejectWithValue }) => {
  try {
    const targetStatus = status.toLowerCase(); // Ensure lowercase to match frontend logic
    
    // Step 1: Update Admissions table status
    const { error: updateError } = await supabase
      .from('admissions')
      .update({ status: targetStatus })
      .eq('id', id);

    if (updateError) throw updateError;

    // Step 2: If accepted, ensure they are in the 'students' authorized list
    if (targetStatus === 'accepted') {
      if (!studentData?.cnic) {
        throw new Error('Student CNIC is missing in metadata');
      }
      
      const cleanCnic = studentData.cnic.toString().replace(/\D/g, ''); // Normalize: remove non-digits
      const rollNumber = `SMIT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const { error: studentError } = await supabase
        .from('students')
        .upsert({
          cnic: cleanCnic,
          roll_number: rollNumber
        }, { onConflict: 'cnic' });

      if (studentError) {
        console.error('Students table upsert error:', studentError);
        throw new Error(`Failed to authorize student: ${studentError.message}`);
      }
    }

    dispatch(fetchStudents());
    return { id, status: targetStatus };
  } catch (error) {
    console.error('Update status thunk error:', error);
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
            cnic: row.cnic?.toString().replace(/\D/g, ''), // Normalize CNIC
            roll_number: row.roll_number?.toString().trim()
          })).filter(r => r.cnic && r.roll_number);

          const { data: insertedData, error } = await supabase
            .from('students')
            .upsert(records, { onConflict: 'cnic' })
            .select();
            
          if (error) throw error;

          // Update admission status to accepted for all matching CNICs
          const cnics = records.map(r => r.cnic);
          if (cnics.length > 0) {
            // Try updating both normalized and potentially non-normalized (just in case)
            const { error: updateError } = await supabase
              .from('admissions')
              .update({ status: 'accepted' })
              .in('cnic', cnics);
            
            if (updateError) {
              console.error('Failed to update admission status', updateError);
            }
          }
          
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
