import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function checkUserRole(user: User | null, supabase: SupabaseClient<any, "public", any>) {
  if(!user || !supabase) return { isAdmin: false };
  const { data, error } = await supabase.from('profiles').select('is_admin').eq('id', user.id);
  // If there were errors or no data was given break and run a error to the console
  if(error || !data) { 
    error ? console.error(error) : console.error(`No data was retrieved`);
    return { isAdmin: false }
  }
  return { isAdmin: data[0].is_admin as boolean | null }
}