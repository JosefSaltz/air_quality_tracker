import { validEmailSchema } from "$zSchemas";
import { error } from "@sveltejs/kit";
import type { Actions } from "./$types";

type FormDataString = string | null

export const actions = {
  "update-profile": async ({ request, locals }) => {
    // Destrucutre our request local variables
    const { supabase, profile } = locals;
    // Ensure the profile exists beforehand
    if(!profile) return error(404, { message: "Profile not found!"})
    // Retrieve formdata from request body
    const formData = await request.formData();
    // Email processing
    const email = formData.get("email") as FormDataString
    const existingEmail = profile.email;
    // Validate and update the email in the db
    if(email) await handleEmail(email, existingEmail);
    // User name processing
    const [ first_name, last_name ] = [formData.get("first_name") as FormDataString, formData.get("last_name") as FormDataString]
    // Update names if there any in supabase
    if(first_name || last_name) await handleNames(first_name, last_name);
    // Default return a form status of success
    return { form: { status: "success" } }
    
    // HELPERS
    async function handleEmail(email: string, existingEmail: string) {
      // Exit out if the email and existing email are the same
      if(email === existingEmail) return console.warn('⚠️ Submitted email is same as existing, no action taken');
      // Validate the email with zod
      const parsedEmail = validEmailSchema.safeParse(email);
      if(parsedEmail.error) return error(400, { message: "Invalid Email"});
      // Update user's email in supabase
      const { error: updateError } = await supabase.auth.updateUser({ email });
      // Handle update errors
      if(updateError) error(500, { message: 'Something went wrong while trying to update user email'});
    }

    async function handleNames(first_name: FormDataString, last_name: FormDataString) {
      if(first_name && first_name !== profile?.first_name) {
        const { error: updateError } = await supabase.from("profiles").update({ first_name });
        if(updateError) return error(500, { message: "Something went wrong updating the user's first name" });
      };

      if(last_name && last_name !== profile?.last_name) {
        const { error: updateError } = await supabase.from("profiles").update({ last_name });
        if(updateError) return error(500, { message: "Something went wrong updating the user's last name" });
      }
    }
  }
} satisfies Actions