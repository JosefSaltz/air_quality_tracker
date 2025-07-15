import { getCachedReports } from "./redis/redis";
export async function getMarkers(supabase: App.Locals["supabase"]) {
  console.log('🚚 Getting Marker Data...')
  // See if we have any cached Reports
  const cachedReports = await getCachedReports();
  // If we don't get them from the DB
  if(!cachedReports ) {
    console.log(`No cached reports found`)
    // Query a specific column set
    const dbMarkers = await supabase.from("reports").select("id, created_at, description, humidity, latitude, longitude, strength, temperature_f, wind_direction, wind_speed_kn");
    // Destructure
    const { error, data } = dbMarkers;
    // Error handling
    if(error) {
      console.error(`Something went wrong trying to retrieve marker data`, error.message);
      return null;
    }
    return data;
  }
  return cachedReports;
}

