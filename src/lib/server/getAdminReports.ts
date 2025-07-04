import type { retrieveDateParams } from "./retrieveDateParams";


export async function getAdminReports(supabase: App.Locals["supabase"], dateRange: ReturnType<typeof retrieveDateParams>) {
  const { start_date, end_date } = dateRange;
 
  const markers = await supabase
    .from("reports")
    .select("id, created_at, description, humidity, latitude, longitude, strength, temperature_f, wind_direction, wind_speed_kn, profiles ( email )")
    .gte('created_at', start_date)
    .lte('created_at', end_date);
  
  const { error } = markers;
  
  if(error) {
    console.error(`❌ Something went wrong trying to retrieve marker data`, error.message);
    return null;
  }
  // Escape early if there isn't any records returned
  if(!markers.data.length) return markers.data;

  const formattedData = markers.data.map(record => {
    const { profiles, ...restOfRecord } = record;
    const { email } = profiles;
    return { ...restOfRecord, email };
  })

  return formattedData;
}