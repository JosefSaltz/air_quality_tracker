<script>
	import "@/app.css";
	import "@/app.css";
  import Navbar from "@/lib/components/Navbar/Navbar.svelte"
  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'

  let { data, children } = $props()
  let { session, supabase } = $derived(data)

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>
<Navbar/>
<div class="flex justify-center h-full">
  <div class="flex flex-col justify-center w-full h-full items-center">
      {@render children()}
  </div>
</div>