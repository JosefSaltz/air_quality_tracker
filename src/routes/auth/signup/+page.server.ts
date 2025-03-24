import { fail, redirect, type Actions, type Load} from "@sveltejs/kit";
import getNonce from "$lib/server/getNonce";
import { PRIVATE_TURNSTILE_SECRET } from "$env/static/private";
import { validateTurnstileToken } from "@/lib/server/validateTurnstileToken";

export const load: Load = () => {
  const googleNonce = getNonce();
  return { googleNonce }
}

export const actions = {
  signup: async ({ request, locals: { supabase } }) => {
    console.log(`📝 Sign Up Request Received!`);
    console.info(`Headers: ${request.headers}`);
    const ip = request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for") ||
      "UNKNOWN";
    if(!ip) {
      console.error(`❌ Failed to get Cloud Flare Connection IP from request headers!`, ip);
      
    }
    // Extract relevant form data
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string;
    // Validate our token
    const { status, captchaToken } = await validateTurnstileToken(formData, ip);
    // Turnstile Error Handling
    if(status !== "succeeded" || !captchaToken) return fail(401, { message: "Failed Captcha Check"}); 
    const { error } = await supabase.auth.signUp({ email, password, options: { captchaToken } })
    
    if (error) {
      console.error(error)
      redirect(303, '/auth/error')
    } 
    
    redirect(303, '/')
    
  },
} satisfies Actions