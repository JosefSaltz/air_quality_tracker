import supabase from "@/lib/utils/client";

export async function getMarkers() {
  const markerData = await supabase.from("reports").select();
  const { error } = markerData;
  if(error) {
    console.error(`Something went wrong trying to retrieve marker data`, error.message);
    return null;
  }
  return markerData;
}