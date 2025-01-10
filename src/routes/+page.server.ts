import { getOrCreateUserProfile } from "$lib/auth";
import { db } from "$lib/db/index.js";
import { getMarkers } from "@/lib/utils/getMarkers";
import { profileTable } from "$lib/db/schema.js";
import { error, redirect, type Actions, type ServerLoad } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { zfd } from "zod-form-data";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const markers = await getMarkers();
  if(!markers) return console.warn('No marker data retrieved');
  return { markers }
};

export const actions = {
  signout: async ({ locals: { supabase } }) => {
    const { error } = await supabase.auth.signOut();
    if(error) console.error(error);
    redirect(303, "/")
  }
} satisfies Actions;
