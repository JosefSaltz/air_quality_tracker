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
  // default: async ({ request, locals }) => {
  //   const userProfile = await getOrCreateUserProfile(locals);

  //   if (!userProfile) error(401, "You need to be logged in!");
    
  //   const schema = zfd.formData({
  //     firstName: zfd.text(),
  //     lastName: zfd.text(),
  //     email: zfd.text(),
  //   });

  //   const { data } = schema.safeParse(await request.formData());

  //   if (!data) error(400, "Invalid form data");

  //   const { firstName, lastName, email } = data;
    
  //   await db
  //     .update(profileTable)
  //     .set({
  //       firstName,
  //       lastName,
  //       email,
  //     })
  //     .where(eq(profileTable.id, userProfile.id));

  //   return { success: true };
  // },
  
} satisfies Actions;
