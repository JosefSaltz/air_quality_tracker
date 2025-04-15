<script lang="ts">
	import "@/app.css";
  import { invalidate } from '$app/navigation'
  import { onMount, type Snippet } from 'svelte'
  import Navbar from "@/lib/components/Navbar/Navbar.svelte"
  import DisclaimerBanner from "@/lib/components/Banner/DisclaimerBanner.svelte";
  import type { LayoutProps } from "./$types";
  
  let { data, children }: LayoutProps = $props()
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
