export async function readGeoPermission() {
  const currentPermission = await navigator.permissions.query({ name: "geolocation" });
  return currentPermission.state;
}