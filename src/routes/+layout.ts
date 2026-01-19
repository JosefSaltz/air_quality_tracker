import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'

import type { LayoutLoad } from './$types'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, PUBLIC_LOCAL_SUPABASE_URL, PUBLIC_LOCAL_SUPABASE_ANON_KEY } from '$env/static/public'
import { dev } from '$app/environment';

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
  /**
   * Declare a dependency so the layout can be invalidated, for example, on
   * session refresh.
   */
  depends('supabase:auth')
  const [SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY] = dev ? [PUBLIC_LOCAL_SUPABASE_URL, PUBLIC_LOCAL_SUPABASE_ANON_KEY] : [PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY];
  const supabase = isBrowser()
    ? createBrowserClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
      })
    : createServerClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
        cookies: {
          getAll() {
            return data.cookies
          },
        },
      })

  /**
   * It's fine to use `getSession` here, because on the client, `getSession` is
   * safe, and on the server, it reads `session` from the `LayoutData`, which
   * safely checked the session using `safeGetSession`.
   */
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { profile } = data;

  return { session, supabase, user, profile }
}