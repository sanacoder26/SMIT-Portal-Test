import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yuzxkvytvrddnmjmgruy.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_JBsEL2knsHDwhNyYct_osA_WnrTSDrK';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("Supabase environment variables are missing. Using fallback values from src/config/supabase.js. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify settings.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
