import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  "reset-password": async ({ request, locals: { supabase } }) => {
    
    const formData = await request.formData();
    const email = formData.get("email") as string;
    if(!email) return fail(400, { message: "A valid email was not "})
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: "/auth/password-update" });
    // Quietly log the error to the console without telling the user
    if(error) console.error(error);
    redirect(303, "/auth/password-reset-sent")
  }
} satisfies Actions