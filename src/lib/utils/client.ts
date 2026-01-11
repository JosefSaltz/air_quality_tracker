import { createClient } from "@supabase/supabase-js";
import type { Database } from "$root/database.types";
import {
  PUBLIC_LOCAL_SUPABASE_ANON_KEY,
  PUBLIC_LOCAL_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import {
  PRIVATE_SUPABASE_LOCAL_SERVICE_ROLE,
  PRIVATE_SUPABASE_SERVICE_ROLE,
} from "$env/static/private";

const inProd = import.meta.env.PROD;
// Dev environment logic
if (!inProd) console.info("Loading dev environment...");
const [SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE] = inProd
  ? [
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    PRIVATE_SUPABASE_SERVICE_ROLE,
  ]
  : [
    PUBLIC_LOCAL_SUPABASE_URL,
    PUBLIC_LOCAL_SUPABASE_ANON_KEY,
    PRIVATE_SUPABASE_LOCAL_SERVICE_ROLE,
  ];
// Null Check
if (!SUPABASE_PROJECT_URL || !SUPABASE_ANON_KEY) {
  console.error("No ENV variables");
}
// Create Clients
const supabase = createClient<Database>(
  SUPABASE_PROJECT_URL!,
  SUPABASE_ANON_KEY!,
);
const supabaseAdmin = createClient<Database>(
  SUPABASE_PROJECT_URL!,
  SUPABASE_SERVICE_ROLE,
);
export default supabase;
export { SUPABASE_ANON_KEY, SUPABASE_PROJECT_URL };
export { supabaseAdmin };
