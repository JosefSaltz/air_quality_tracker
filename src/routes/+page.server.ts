import { getOrCreateUserProfile } from "$lib/auth";
import { db } from "$lib/db/index.js";
import { profileTable } from "$lib/db/schema.js";
import { error, redirect, type Actions } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { zfd } from "zod-form-data";

export const load = async ({ locals }) => {
  const userProfile = await getOrCreateUserProfile(locals);

  return { userProfile };
};

export const actions = {
  default: async ({ request, locals }) => {
    const userProfile = await getOrCreateUserProfile(locals);

    if (!userProfile) error(401, "You need to be logged in!");
    
    const schema = zfd.formData({
      firstName: zfd.text(),
      lastName: zfd.text(),
      email: zfd.text(),
    });

    const { data } = schema.safeParse(await request.formData());

    if (!data) error(400, "Invalid form data");

    const { firstName, lastName, email } = data;
    
    await db
      .update(profileTable)
      .set({
        firstName,
        lastName,
        email,
      })
      .where(eq(profileTable.id, userProfile.id));

    return { success: true };
  },
  // These two are from the Supabase docs template
  signup: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error(error)
      redirect(303, '/auth/error')
    } else {
      redirect(303, '/')
    }
  },

  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error)
      redirect(303, '/auth/error')
    } else {
      redirect(303, '/private')
    }
  },
} satisfies Actions;
