import { getMarkers } from "@/lib/utils/getMarkers";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import crypto from "crypto";
import { fetchMeteoData } from "@/lib/utils/fetchMeteoData";
import type { GeoCoords } from "@/lib/components/ReportMap/ReportMap.svelte";

export const load: PageServerLoad = async ({ locals }) => {
  // Fetch minimum required data
  const markers = await getMarkers();
  // Generate cryptographic nonce for use with Google SSO
  const googleNonce = crypto.randomUUID();
  if(!markers) return console.warn('No marker data retrieved');
  return { googleNonce, markers: markers.data };
};

export const actions = {
  report: async({ request, locals: { supabase, user, session }}) => {
    // Action Level Auth Guard
    if(!user || !session) return console.error('User is not authenticated for submission');
    // Assign necessary form data
    const formData = await request.formData();
    const latitude = formData.get("latitude") as GeoCoords["latitude"] | null;
    const longitude = formData.get("longitude") as GeoCoords["longitude"] | null;
    const location = formData.get("location");
    const description = formData.get("description");
    const strength = formData.get("strength");
    const created_by = user.id;

    const meteoResponse = await fetchMeteoData({ latitude, longitude });
    let meteoData;
    if(meteoResponse) {
      const { minutely15: { windSpeed10m, windDirection10m, temperature2m } } = meteoResponse;
      meteoData = { temperature2m, windDirection10m, windSpeed10m };
    }
    // Attempt to insert to DB
    const response = await supabase
      .from("reports")
      .insert({
        created_by,
        description,
        latitude,
        longitude,
        location,
        strength,
        wind_speed: meteoData?.windSpeed10m,
        wind_direction: meteoData?.windDirection10m,
        temperature: meteoData?.temperature2m
      });
    if(response.error) fail(400, {})
    return response;
  }
} satisfies Actions