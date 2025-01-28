import { getMarkers } from "@/lib/utils/getMarkers";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import crypto from "crypto";
import { fetchMeteoData } from "@/lib/utils/fetchMeteoData";
import type { TablesInsert } from "$root/database.types";
import z from "zod";

export const load: PageServerLoad = async ({ locals }) => {
  // Fetch minimum required data
  const markers = await getMarkers();
  // Generate cryptographic nonce for use with Google SSO
  const googleNonce = crypto.randomUUID();
  if(!markers) return console.warn('No marker data retrieved');
  return { googleNonce, markers: markers.data };
};
// Deepseek generated schema
const ReportSchema = z.object({
  created_by: z.string(), // Assuming user.id is a string (e.g., UUID)
  description: z.string(),
  latitude: z.number().refine((val) => val >= -90 && val <= 90, "Invalid latitude"),
  longitude: z.number().refine((val) => val >= -180 && val <= 180, "Invalid longitude"),
  location: z.string(),
  strength: z.enum(['Faint', 'Strong', 'Overwhelming']),
  humidity: z.number().nullable(), // Allow null if meteo data is unavailable
  precipitation: z.number().nullable(),
  wind_speed: z.number().nullable(),
  wind_direction: z.number().nullable(), 
  temperature: z.number().nullable()
});

export const actions = {
  report: async({ request, locals: { supabase, user, session }}) => {
    // Action Level Auth Guard
    if(!user || !session) return console.error('User is not authenticated for submission');
    // Assign necessary form data
    const formData = await request.formData();
    const latitude = formData.get("latitude");
    const longitude = formData.get("longitude");
    // Preliminary Type Checks
    if(typeof latitude !== "number") return console.error(`Latitude is not a number!`);
    if(typeof longitude !== "number") return console.error(`Longitude is not a number!`);
    // Grab remaining form values
    const location = formData.get("location");
    const description = formData.get("description");
    const strength = formData.get("strength");
    const created_by = user.id;
    // Fetch weather and wind from OpenMeteo
    const meteoResponse = await fetchMeteoData({ latitude, longitude });
    // Initialize conditional variable
    let meteoData;
    // Assign payload to meteoData if it exists
    if(meteoResponse) {
      const { current: { windSpeed10m, windDirection10m, temperature2m, relativeHumidity2m, precipitation  } } = meteoResponse;
      meteoData = { temperature2m, windDirection10m, windSpeed10m, precipitation, relativeHumidity2m };
    }
    // Assign payload
    const insertPayload = {
      created_by,
      description,
      humidity: meteoData?.relativeHumidity2m,
      precipitation: meteoData?.precipitation,
      latitude,
      longitude,
      location,
      strength,
      wind_speed: meteoData?.windSpeed10m,
      wind_direction: meteoData?.windDirection10m,
      temperature: meteoData?.temperature2m
    };
    // Run full payload validation before inserting
    const validatedInsert = ReportSchema.parse(insertPayload)
    // Attempt to insert to DB
    const response = await supabase
      .from("reports")
      .insert(validatedInsert satisfies TablesInsert<"reports">);
    if(response.error) fail(400, {})
    return response;
  }
} satisfies Actions