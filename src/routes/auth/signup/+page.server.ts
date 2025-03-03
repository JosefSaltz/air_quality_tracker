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
    // Extract relevant form data
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string;
    const turnstileResult = await validateTurnstileToken(request);
    // Turnstile Error Handling
    if(turnstileResult?.status !== "verified") return fail(401, { message: "Failed Captcha Check"}); 
    const { error } = await supabase.auth.signUp({ email, password })
    
    if (error || !turnstileVerification.ok) {
      console.error(error)
      redirect(303, '/auth/error')
    } 
    
    redirect(303, '/')
    
  },
} satisfies Actions