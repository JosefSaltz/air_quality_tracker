<script lang="ts">
	import "@/app.css";
  import Navbar from "@/lib/components/Navbar/Navbar.svelte"
  import { invalidate } from '$app/navigation'
  import { onMount, type Snippet } from 'svelte'
  import type { LayoutData } from "./$types";
  import DisclaimerBanner from "@/lib/components/Banner/DisclaimerBanner.svelte";
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

<div class="flex flex-col w-full h-screen">
  <DisclaimerBanner />
  <Navbar profile={profile} user={user} supabase={supabase} />
  {@render children()}
</div>
