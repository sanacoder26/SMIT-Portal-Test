import { createClient } from '@supabase/supabase-js';

// Hardcoded for hosting reliability
const supabaseUrl = 'https://yuzxkvytvrddnmjmgruy.supabase.co';
const supabaseKey = 'sb_publishable_JBsEL2knsHDwhNyYct_osA_WnrTSDrK';

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials missing in config/supabase.js");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
