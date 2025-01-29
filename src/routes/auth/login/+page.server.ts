import type { AuthError } from "@supabase/supabase-js";
import { redirect, type Actions, fail } from "@sveltejs/kit";

export const actions = {
  login: async ({ request, locals: { supabase }, params }) => {
    const handleError = (error: AuthError | null) => {
      if (error) {
        console.error(error)
        return fail(401, { error })
      } 
      redirect(303, '/')
    }
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string;
    let hadError = null;
    // Social OAuth
    if(params?.sso && params?.provider === "google") {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google'})
      hadError = error;
    }
    // Default Email Password
    else { 
      const { error } = await supabase.auth.signInWithPassword({ email, password }) 
      hadError = error;
    }
    // Error handling
    if(hadError) return handleError(hadError);
  },
} satisfies Actions;