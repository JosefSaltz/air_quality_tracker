import { getOrCreateUserProfile } from "$lib/auth";
import { error, redirect, type Actions } from "@sveltejs/kit";
import { OPENMETEO_URL } from "$app/environment"
import { fetchWeatherApi } from "openmeteo";
import { fetchWind } from "@/lib/api/openmeteo.js";
import { destructureReport } from "@/lib/utils/destructureReport.js";

export const load = async ({ locals }) => {
  const userProfile = await getOrCreateUserProfile(locals);

  return { userProfile };
};

export const actions = {
  // Supabase Doc Template Action
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error)
      return redirect(303, '/auth/error')
    } 
    redirect(303, '/')
  },
  // Supabase Doc Template Action
  signup: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const { error } = await supabase.auth.signUp({ email, password }); // Autoconfirm?

    if (error) {
      console.error(error)
      return redirect(303, '/auth/error')
    }
    redirect(303, '/auth/confirm')
  },
  // Action for uploading air quality reports
  report: async ({request, locals: { supabase }}) => {
    // Retrieve formData
    const formData = await request.formData();
    // Assign all the key-values we need via the form data getters
    const { latitude, longitude, description, odor_type, strength } = destructureReport(formData);
    // Get the optional but very recommended windspeeds via open-meteo
    const { windSpeed, windDirection } = await fetchWind(latitude!, longitude!);
    // Compile report data
    const reportData = {
      latitude,
      longitude,
      windSpeed,
      windDirection,
      description,
      strength,
      odor_type
    }
    // Insert to reports table
    const { error } = await supabase
       .from("reports")
       .insert(reportData);
    // Log any errors
    if(error) console.error(`Something has gone wrong while trying to file a report`, error);
  }
} satisfies Actions;
