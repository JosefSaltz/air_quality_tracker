export function destructureReport(formData: FormData) {
  // Big ol' getter block from archaic pre-ES5 times
  const latitude = formData.get("latitude");
  const longitude = formData.get("longitude");
  const description = formData.get("description");
  const strength = formData.get("strength");
  const odor_type = formData.get("odor_type");
  
  return { latitude, longitude, description, strength, odor_type };
}