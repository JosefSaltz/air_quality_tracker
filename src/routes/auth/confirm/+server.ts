import { redirect } from '@sveltejs/kit'
import { type EmailOtpType } from '@supabase/supabase-js'

export const GET = async (event) => {
  const {
    url,
    locals: { supabase },
  } = event
  const token_hash = url.searchParams.get('token') as string
  const type = url.searchParams.get('type') as EmailOtpType | null
  const next = url.searchParams.get('next') ?? '/'
  console.log(`Type: `, type);
  console.log('Next: ', next);
  /**
   * Clean up the redirect URL by deleting the Auth flow parameters.
   *
   * `next` is preserved for now, because it's needed in the error case.
   */
  const redirectTo = new URL(url)
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if(error) console.error(error);
    if (!error) {
      redirectTo.searchParams.delete('next')
      return redirect(303, redirectTo)
    }
  }
  
  // return the user to an error page with some instructions
  redirectTo.pathname = '/auth/error'
  redirect(303, redirectTo)
}