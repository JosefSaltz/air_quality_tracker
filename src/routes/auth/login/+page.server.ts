import { NODE_ENV } from "$env/static/private";
import { PUBLIC_DEV_AUTH_REDIRECT_URL, PUBLIC_AUTH_REDIRECT_URL } from "$env/static/public";
import { type Actions, fail, redirect } from "@sveltejs/kit";
import type { AuthError } from "@supabase/supabase-js";
import { validateTurnstileToken } from "$lib/server/validateTurnstileToken";
import { z } from "zod";
import { isActionFailure } from "@sveltejs/kit";
import { readEmailAuthRequest } from "@/lib/server/readEmailAuthRequest";
// Form Action definitions
export const actions = {
  login: async ({ request, locals: { supabase }, params }) => {
    // Action Logging
    console.log(`🗝️ Login Request Received!`);
    console.info(`📧 Headers: ${JSON.stringify(request.headers)}`);
    try {
      // Attempt to read signup request data
      const reqData = await readEmailAuthRequest(request);
      // Error handling
      if(isActionFailure(reqData)) throw Error(`❌ readEmailAuthRequest Failed`);
      // Destructure Data
      const { turnstileIP, turnstileResponse, email, password } = reqData;
      // Validate our Turnstile Captcha Token
      const tokenIsValid = await validateTurnstileToken(turnstileResponse, turnstileIP);
      // Turnstile Error Handling
      if(!tokenIsValid) throw Error(`❌ validateTurnstileToken Failed`);;
      // Process the sign in request with supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      // Login Error Handling
      if (error) return({ code:'error', message: "Invalid Login"});
    }
    catch(err) {
      console.error(`❌ Error during server-side 'login' action: `, err);
      redirect(303, '/auth/error');
    }
    redirect(303, "/");
  },
  
  google_auth: async ({ request, locals: { supabase }, params}) => {
    const handleError = (error: AuthError | null) => {
      if (error) {
        console.error(error);
        return fail(401, { error });
      }
    }
    const redirectTo = NODE_ENV !== "production"  ? 
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

