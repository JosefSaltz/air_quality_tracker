import { resolveRoute } from "$app/paths";
import { GoTrueClient } from "@supabase/supabase-js";

export async function readGeoPermission() {
  const currentPermission = await navigator.permissions.query({ name: "geolocation" });
  return currentPermission.state;
}