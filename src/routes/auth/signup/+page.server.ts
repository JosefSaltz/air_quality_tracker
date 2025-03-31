import { fail, isActionFailure, redirect, type Actions, type Load} from "@sveltejs/kit";
import getNonce from "$lib/server/getNonce";
import { validateTurnstileToken } from "@/lib/server/validateTurnstileToken";
import { readEmailAuthRequest } from "@/lib/server/readEmailAuthRequest";
import { validateEmailAndPassword } from "@/lib/utils/validateEmailAndPassword";

export const load: Load = () => {
  const googleNonce = getNonce();
  return { googleNonce }
}

export const actions = {
  signup: async ({ request, locals: { supabase } }) => {
    // Action Logging
    console.log(`📝 Sign Up Request Received!`);
    console.info(`📧 Headers: ${request.headers}`);
    try {
      // Attempt to read signup request data
      const reqData = await readEmailAuthRequest(request);
      // Error handling
      if(isActionFailure(reqData)) throw Error(`❌ readEmailAuthRequest Failed`);
      // Destructure Data
      const { turnstileIP, turnstileResponse, email, password, first_name, last_name } = reqData;
      // Validate the request's token with Cloudflare  
      const tokenIsValid = await validateTurnstileToken(turnstileResponse, turnstileIP);
      // Error Handling
      if(!tokenIsValid) throw Error(`❌ validateTurnstileToken Failed`);
      // Check the email and password before saving to DB
      validateEmailAndPassword(email, password);
      // Perform signup action on the DB
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: 
        { 
          captchaToken: turnstileResponse, 
          emailRedirectTo: '/auth/email-confirm' 
        } 
      });
      // If an error occurred redirect
      if (error) { fail(400, { error }) };
    }
    catch(err) {
      console.error(`❌ Error during server-side 'signup' action: `, err);
      redirect(303, '/auth/error');
    }
    // Default redirect to root
    redirect(303, '/auth/welcome');
  }
} satisfies Actions