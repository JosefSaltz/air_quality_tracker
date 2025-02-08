import { NODE_ENV } from "$env/static/private";
import { PUBLIC_DEV_AUTH_REDIRECT_URL, PUBLIC_AUTH_REDIRECT_URL } from "$env/static/public";
import { type Actions, fail, redirect } from "@sveltejs/kit";
import type { AuthError } from "@supabase/supabase-js";
import { validateTurnstileToken } from "$lib/server/validateTurnstileToken";
import { z } from "zod";
// Zod Validation Schemas
const validEmail = z.string().email();
const validPassword = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one digit")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
  // Generic Error Handler
  function handleError (error: AuthError | null) {
    if (error) {
      console.error(error);
      return fail(401, { error });
    }
    redirect(303, "/");
  };
// Form Action definitions
export const actions = {
  login: async ({ request, locals: { supabase }, params }) => {
    // Validate our Turnstile Captcha Token
    const captchaResult = await validateTurnstileToken(request);
    // Turnstile Error Handling
    if(captchaResult?.status !== "verified") return fail(401, { message: "Failed Captcha Check"});
    // Load form data
    const formData = await request.formData();
    // Validate Email
    const emailResult = await validEmail.safeParseAsync(formData.get("email"));
    if(emailResult.error) return fail(422, { message: emailResult.error.message});
    // Validate Password
    const passwordResult = await validPassword.safeParseAsync(formData.get("password"));
    if(passwordResult.error) return fail(422, { message: passwordResult.error.message});
    // QOL Assign validated values
    const [ email, password ] = [ emailResult.data, passwordResult.data ]
    // Process the sign in request with supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // Error handling
    if (error) return handleError(error);
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

