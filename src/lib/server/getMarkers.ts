import { getRedisStatus } from "$lib/server/redis/state";
import { getCachedReports, pingRedis } from "$lib/server/redis";

export async function getMarkers(supabase: App.Locals["supabase"]) {
  console.log('🚚 Getting Marker Data...')
  // Retrieve Redis health state
  const { redisOnline } = getRedisStatus();
  // See if we have any cached reports
  const cachedReports = redisOnline ? await getCachedReports() : undefined;
  // If we don't, get them from the DB
  if(!cachedReports) {
    redisOnline ? console.log(`No cached reports found`) : console.warn('⚠️ Cache Unavailable Querying DB directly...')
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