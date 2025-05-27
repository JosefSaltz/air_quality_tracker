import { fail, redirect, type Actions } from "@sveltejs/kit";

export const actions = {
  "resend-verification": async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const { error } = await supabase.auth.resend({ 
      type: 'signup',
      email 
    });
    // Quietly log the error to the console without telling the user
    if(error) console.error(error);
    redirect(303, "/auth/resend-verification-sent");
  }
} satisfies Actions