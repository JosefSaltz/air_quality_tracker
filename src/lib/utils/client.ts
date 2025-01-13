import { createClient } from "@supabase/supabase-js"
import type { Database } from "$root/database.types";
import { 
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
  PUBLIC_LOCAL_SUPABASE_ANON_KEY,
  PUBLIC_LOCAL_SUPABASE_URL, 
} from '$env/static/public';

const inProd = import.meta.env.PROD;
// Dev environment logic
if(!inProd) console.info('Loading dev environment...');

console.log(`env:`, import.meta.env.PROD);
const SUPABASE_PROJECT_URL = inProd ? PUBLIC_SUPABASE_URL : PUBLIC_LOCAL_SUPABASE_URL
const SUPABASE_ANON_KEY = inProd ? PUBLIC_SUPABASE_ANON_KEY : PUBLIC_LOCAL_SUPABASE_ANON_KEY;
// Null Check
if(!SUPABASE_PROJECT_URL || !SUPABASE_ANON_KEY) console.error("No ENV variables");

const supabase = createClient<Database>(SUPABASE_PROJECT_URL!, SUPABASE_ANON_KEY!);

export default supabase;
export { SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY}