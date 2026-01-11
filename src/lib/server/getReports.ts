import type { retrieveDateParams } from "./retrieveDateParams";

export async function getReports(supabase: App.Locals["supabase"], dateRange: ReturnType<typeof retrieveDateParams>) {
  const { start_date, end_date } = dateRange;
 
  const {error, data} = await supabase
    .from("reports")
    .select("id, created_at, description, humidity, latitude, longitude, strength, temperature_f, wind_direction, wind_speed_kn")
    .gte('created_at', start_date)
    .lte('created_at', end_date);
  
  if(error) {
    console.error(`❌ Something went wrong trying to retrieve marker data`, error.message);
    return null;
  }
  // Escape early if there isn't any records returned
  if(!data.length) return null;
  // Return data
  return { markerReports: data };
}