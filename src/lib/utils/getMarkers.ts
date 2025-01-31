import supabase from "@/lib/utils/client";

export async function getMarkers() {
  const markers = await supabase.from("reports").select("id, created_at, description, humidity, latitude, longitude, strength, temperature_f, wind_direction, wind_speed_kn");
  const { error } = markers;
  if(error) {
    console.error(`Something went wrong trying to retrieve marker data`, error.message);
    return null;
  }
  return markers.data;
}