import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  "resend-verification": async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    console.log(`Resending a verification email!`)
    const { error } = await supabase.auth.resend({ 
      type: 'signup',
      email 
    });
    // Quietly log the error to the console without telling the user
    if(error) console.error(error);
    redirect(303, "/support/resend/verification-sent");
  }
} satisfies Actions