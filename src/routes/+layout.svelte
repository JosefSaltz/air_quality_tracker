<script lang="ts">
	import "@/app.css";
  import Navbar from "@/lib/components/Navbar/Navbar.svelte"
  import { invalidate } from '$app/navigation'
  import { onMount, type Snippet } from 'svelte'
  import type { LayoutData } from "./$types";
  let { data, children }: { data: LayoutData, children: Snippet } = $props()
  let { session, supabase, user, profile } = $derived(data);
  
  // $inspect(data)
  // Auth Event Listener
  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

<Navbar profile={ profile } user={user} supabase={supabase} />
<div class="flex justify-center h-full">
  <div class="flex flex-col justify-center w-full h-full items-center">
      {@render children()}
  </div>
</div>