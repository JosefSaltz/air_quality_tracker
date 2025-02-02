import type { AuthError } from "@supabase/supabase-js";
import { type Actions, fail, redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { PUBLIC_DEV_AUTH_REDIRECT_URL, PUBLIC_AUTH_REDIRECT_URL } from "$env/static/public";

export const actions = {
  login: async ({ request, locals: { supabase }, params }) => {
    const handleError = (error: AuthError | null) => {
      if (error) {
        console.error(error);
        return fail(401, { error });
      }
      redirect(303, "/");
    };
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // Default Email Password
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // Error handling
    if (error) return handleError(error);
    redirect(303, "/")
  },
  google_auth: async ({request, locals: { supabase }, params}) => {
    const handleError = (error: AuthError | null) => {
      if (error) {
        console.error(error);
        return fail(401, { error });
      }
    }
    const redirectTo = dev ? 
      PUBLIC_DEV_AUTH_REDIRECT_URL : 
      PUBLIC_AUTH_REDIRECT_URL;
    console.log('Redirect URL:', redirectTo);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo }
    });
    if(error) handleError(error);
    if (data.url) redirect(301, data.url); 
    // use the redirect API for your server framework
  }
} satisfies Actions;