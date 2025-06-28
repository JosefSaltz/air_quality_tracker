import { validEmailSchema } from "$zSchemas";
import { type Actions, error } from "@sveltejs/kit";

export const actions = {
  "update-profile": async ({ request, locals }) => {
    // Destrucutre our request local variables
    const { user, supabase, profile } = locals;
    // Retrieve formdata from request body
    const formData = await request.formData();
    // Instantiate an object with getter calls
    const submittedData = {
      first_name: formData.get("first-name") as string | null,
      last_name: formData.get("last-name") as string | null,
      email: formData.get("email") as string | null
    } as const;
    // Iterating over k,v pairs of the submitted data
    for(const [key, value] of Object.entries(submittedData)) {
      // If submitted data key matches a profile column and the data doesn't match
      if(profile[key] && profile[key] !== value) {
        // Prevent deleting of user's email with falsy values or invalid email format
        if(key === "email" && !value || validEmailSchema.safeParse(value).error) return error(400, { message: 'Submitted invalid email value'});
        // Update the user's profile information with the corresponding key
        const { error: responseError } = await supabase.from("profiles").update({ [key]: value ?? undefined })
        // Error handling
        if(responseError) {
          console.error(responseError) 
          return error(500, { message: `Something went wrong while trying to process your request`})
        }
        // Default success
        return { success:true,  message: `Profile Updated Successfully`}
      }
    }
  }
} satisfies Actions