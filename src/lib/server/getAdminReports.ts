export async function getAdminReports(supabase: App.Locals["supabase"]) {
  const markers = await supabase
    .from("reports")
    .select("id, created_at, description, humidity, latitude, longitude, strength, temperature_f, wind_direction, wind_speed_kn, profiles ( email )");
  
    const { error } = markers;
  
  if(error) {
    console.error(`❌ Something went wrong trying to retrieve marker data`, error.message);
    return null;
  }

  const formattedData = markers.data.map(record => {
    const { profiles, ...restOfRecord } = record;
    const { email } = profiles;
    return { ...restOfRecord, email };
  })

  return formattedData;
}