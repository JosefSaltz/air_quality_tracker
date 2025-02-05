import { redirect, type Actions, type Load} from "@sveltejs/kit";
import getNonce from "$lib/server/getNonce";

export const load: Load = () => {
  const googleNonce = getNonce();
  return { googleNonce }
}

export const actions = {
  signup: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({ email, password })
    
    if (error) {
      console.error(error)
      redirect(303, '/auth/error')
    } 
    
    redirect(303, '/')
    
  },
} satisfies Actions