import { db } from "$lib/db";
import { profileTable } from "$lib/db/schema";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
// Server function
export const getOrCreateUserProfile = async (locals: App.Locals) => {
  const { user } = await locals.safeGetSession();

  if (!user) return null;
  
  const curProfile = await db.query.profileTable.findFirst({
    where: eq(profileTable.id, user.id),
  });

  if (curProfile) {
    return curProfile;
  }

  return null;
};