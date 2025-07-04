import { validPasswordSchema } from "$zSchemas";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  "password-update": async ({ request, locals: { safeGetSession, supabase }}) => {
    // Validate User
    const { user, session } = await safeGetSession()
    if(!user || !session) return fail(401, { message: "Unauthorized Request"})
    // Extract FormData object
    const formData = await request.formData();
    // Retrieve password and handle if invalid
    const password = formData.get("password") as string;
    if(!password) return fail(400, { message: "Did not received updated password"});
    // Validate the new password server side
    const passwordIsValid = validPasswordSchema.safeParse(password);
    if(!passwordIsValid.success) fail(400, { message: `Invalid password: ${passwordIsValid.error.message}`})
    // Update the Supabase User's password and handle a 500 response if error
    const { error } = await supabase.auth.updateUser({ password });
    if(error) fail(500, { message: "Something went wrong while trying to update user's password"})
    // Send the user to the confirmation screen
    redirect(303, "/auth/password-updated")
  }
} satisfies Actions