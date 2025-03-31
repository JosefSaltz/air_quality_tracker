import { validPasswordSchema } from "@/lib/utils/zSchemas/validPasswordSchema";
import { fail, redirect, type Actions } from "@sveltejs/kit";

export const actions = {
  "password-update": async ({ request, locals: { supabase }}) => {
    // Validate User
    const user = await supabase.auth.getUser()
    if(!user) return fail(401, { message: "Unauthorized Request"})
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