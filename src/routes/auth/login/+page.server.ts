import type { AuthError } from "@supabase/supabase-js";
import { type Actions, fail, redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";

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
    const { provider, sso } = params;
    let hadError = null;
    // Social OAuth
    if (sso && provider === "google") {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: dev
            ? "http://localhost:3000/auth/callback"
            : "https://piita.org/auth/callback",
        },
      });

      if (data.url) {
        redirect(301, data.url); // use the redirect API for your server framework
      }
      hadError = error;
    } // Default Email Password
    else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      hadError = error;
    }
    // Error handling
    if (hadError) return handleError(hadError);
    redirect(303, "/")
  },
} satisfies Actions;