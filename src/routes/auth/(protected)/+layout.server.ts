import { redirect } from '@sveltejs/kit';
// Route protection if user does not have a valid session
export const load = async ({ locals: { safeGetSession } }) => {
  const { user, session } = await safeGetSession()
  if(!user || !session) redirect(303, "/")
}