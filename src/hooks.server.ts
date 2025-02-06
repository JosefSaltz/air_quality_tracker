import { dev } from "$app/environment";
import {
  PUBLIC_LOCAL_SUPABASE_ANON_KEY,
  PUBLIC_LOCAL_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import { createServerClient } from "@supabase/ssr";
import { type Handle, redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
// Handle dynamic assignment
const [SUPABASE_URL, SUPABASE_ANON_KEY] = dev
  ? [PUBLIC_LOCAL_SUPABASE_URL, PUBLIC_LOCAL_SUPABASE_ANON_KEY]
  : [PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY];
// Request middleware
export const supabase: Handle = async ({ event, resolve }) => {
  // Security Headers
  event.setHeaders({
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Frame-Options': 'Deny',
    'X-Content-Type-Options': 'nosniff'
    //'Referrer-Policy': 'no-referrer'
  })
  event.locals.supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return event.cookies.getAll();
        },
        setAll(cookiesToSet) {
          /**
           * Note: You have to add the `path` variable to the
           * set and remove method due to sveltekit's cookie API
           * requiring this to be set, setting the path to an empty string
           * will replicate previous/standard behavior (https://kit.svelte.dev/docs/types#public-types-cookies)
           */
          cookiesToSet.forEach(({ name, value, options }) =>
            event.cookies.set(name, value, { ...options, path: "/" })
          );
        },
      },
    },
  );
  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  // NOTE: This method may cause warnings in the console due to being a wrapper for an unsafe method
  event.locals.safeGetSession = async () => {
    // Retrieve the session for this request
    const { data: { session } } = await event.locals.supabase.auth.getSession();
    // If no valid session return nothing
    if (!session) return { session: null, user: null };
    // Destructure user and error
    const { data: { user }, error } = await event.locals.supabase.auth
      .getUser();
    // If JWT validation has failed
    if (error) return { session: null, user: null };
    // Return our supabase session and user objects
    return { session, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    },
  });
};

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.user = user;

  if (!event.locals.session && event.url.pathname.startsWith("/private")) {
    redirect(303, "/auth");
  }

  if (event.locals.session && event.url.pathname === "/auth") {
    redirect(303, "/private");
  }

  return resolve(event);
};

export const handle: Handle = sequence(
  supabase,
  authGuard,
);