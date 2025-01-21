import { getMarkers } from "@/lib/utils/getMarkers";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  // Fetch minimum required data
  const markers = await getMarkers();
  if(!markers) return console.warn('No marker data retrieved');
  return { markers: markers.data }
};

export const actions = {
  report: async({ request, locals: { supabase, user, session }}) => {
    // Action Level Auth Guard
    if(!user || !session) return console.error('User is not authenticated for submission');
    // Assign necessary form data
    const formData = await request.formData();
    const latitude = formData.get("latitude");
    const longitude = formData.get("longitude");
    const location = formData.get("location");
    const description = formData.get("description");
    const strength = formData.get("strength");
    const created_by = user.id;
    // Attempt to insert to DB
    const response = await supabase
      .from("reports")
      .insert({
        created_by,
        description,
        latitude,
        longitude,
        location,
        strength
      });
    if(response.error) fail(400, {})
    return response;
  }
} satisfies Actions