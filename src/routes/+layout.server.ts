import type { Session, User } from '@supabase/supabase-js';
import type { LayoutServerLoad } from './$types'
import supabase from '$lib/utils/client';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
  const { user, session } = await safeGetSession();  
  const profile = await getProfile(user, session);
  return {
    session,
    cookies: cookies.getAll(),
    profile
  }
}

async function getProfile(user: User | null, session: Session | null) {
  // Return null in the event something is up with auth
  if(!session || !user) return null;
  // Get the users profile by user id
  const response = await supabase.from("profiles").select('*').eq('id', user.id);
  // Handle Errors
  const { error } = response;
  if(error) {
    console.error(`Supabase Error:`, error);
    return null;
  }
  // Return the first row
  return response.data[0];
}

export type ProfileResponse = Awaited<ReturnType<typeof getProfile>>;