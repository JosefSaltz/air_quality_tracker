import { getMarkers } from "$lib/server/getMarkers";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import getNonce from "$lib/server/getNonce";
import { fetchMeteoData } from "$lib/server/fetchMeteoData";
import type { TablesInsert } from "$root/database.types";
import { cacheReports } from "$lib/server/redis";
import z from "zod";

const ReportSchema = z.object({
  created_by: z.string(), // Assuming user.id is a string (e.g., UUID)
  description: z.string(),
  latitude: z.number().refine(
    (val: number) => val >= -90 && val <= 90,
    "Invalid latitude",
  ),
  longitude: z.number().refine(
    (val: number) => val >= -180 && val <= 180,
    "Invalid longitude",
  ),
  location: z.string(),
  strength: z.enum(["Faint", "Strong", "Overwhelming"]),
  humidity: z.number().nullable(), // Allow null if meteo data is unavailable
  precipitation: z.number().nullable(),
  wind_speed_kn: z.number().nullable(),
  wind_direction: z.number().nullable(),
  temperature_f: z.number().nullable(),
});

export const load: PageServerLoad = async ({ locals }) => {
  const { supabase } = locals;
  // Fetch minimum required data
  const markers = await getMarkers(supabase);
  // Generate cryptographic nonce for use with Google SSO
  const googleNonce = getNonce();
  
  return { googleNonce, markers };
};

export const actions = {
  report: async ({ request, locals: { supabase, user, session } }) => {
    // Action Level Auth Guard
    if (!user || !session) return console.error("User is not authenticated for submission");
    // Assign necessary form data
    const formData = await request.formData();
    const latitude = Number(formData.get("latitude"));
    const longitude = Number(formData.get("longitude"));
    // Preliminary Type Checks
    if (typeof latitude !== "number") {
      console.error(`Latitude is ${typeof latitude}, not a number!`);
      return fail(400, { error: "Latitude is not a number"});
    }
    if (typeof longitude !== "number") {
      console.error(`❌ Longitude is ${typeof longitude}, not a number!`);
      return fail(400, { error: "Longitude is not a number" });
    }
    // Grab remaining form values
    const location = formData.get("location");
    const description = formData.get("description");
    const strength = formData.get("strength");
    const created_by = user.id;
    // Fetch weather and wind from OpenMeteo
    const meteoResponse = await fetchMeteoData({ latitude, longitude });
    // Initialize conditional variable
    let meteoData;
    // Encapsulate open meteo api data and assignment
    if (meteoResponse) {
      // Destructure requested Data
      const {
        current: {
          windSpeed10m,
          windDirection10m,
          temperature2m,
          relativeHumidity2m,
          precipitation,
        },
      } = meteoResponse;
      // Assign to higher scope variable
      meteoData = {
        temperature2m,
        windDirection10m,
        windSpeed10m,
        precipitation,
        relativeHumidity2m,
      };
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
      wind_speed_kn: meteoData?.windSpeed10m,
      wind_direction: meteoData?.windDirection10m,
      temperature_f: meteoData?.temperature2m,
    };
    console.log(`🔎 Insert Payload:`, insertPayload)
    // Run full payload validation before inserting
    const validatedInsert = ReportSchema.parse(insertPayload);
    // Attempt to insert to DB
    const response = await supabase
      .from("reports")
      .insert(validatedInsert satisfies TablesInsert<"reports">)
      .select();
    if (response.error) return fail(400, {});
    // Invalidate reports cache after db has been updated
    cacheReports();
    // Assign 
    let newMarker = response.data?.[0];
    return { success: true, newMarker}
  },
} satisfies Actions;
