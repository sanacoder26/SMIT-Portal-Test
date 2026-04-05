import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yuzxkvytvrddnmjmgruy.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_JBsEL2knsHDwhNyYct_osA_WnrTSDrK';

export const supabase = createClient(supabaseUrl, supabaseKey);
