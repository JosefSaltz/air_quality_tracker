import { fail, type Actions } from "@sveltejs/kit";

export const actions = {
  "reset-password": async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    if(!email) return fail(400)
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: "/auth/password-update" });
    if(error) return fail(500);
  }
} satisfies Actions