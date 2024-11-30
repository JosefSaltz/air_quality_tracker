import { createClient } from "@supabase/supabase-js"

const { 
  VITE_SUPABASE_PROJECT_URL: SUPABASE_PROJECT_URL, 
  VITE_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY 
} = import.meta.env;

if(!SUPABASE_PROJECT_URL || !SUPABASE_ANON_KEY) console.error("No ENV variables")
const supabase = createClient(SUPABASE_PROJECT_URL!, SUPABASE_ANON_KEY!);

export default supabase;