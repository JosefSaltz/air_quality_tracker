<script lang="ts">
  import type { PageProps } from "../../../routes/$types";
  import * as Popover from "$components/ui/popover";
  import type { ComponentProps } from "svelte";
  import type { ClassValue } from "svelte/elements";
  let menuOpen = $state(false);
  
  const handleMenuClick = (cb?: () => any) => {
    cb && cb();
  }

  type Props = {
    user: PageProps["data"]["user"], 
    profile: PageProps["data"]["profile"], 
    supabase: PageProps["data"]["supabase"],
    class: ClassValue
  }

  let { user, profile, supabase, class: style }: Props = $props();

  let toggleMenu = () => { menuOpen = !menuOpen };
  const handleSignOut = async () => { 
    const { error } = await supabase.auth.signOut();
    error && console.error(error); 
    location.reload();
  }
</script>
<div class={style}>
  <Popover.Root>
    <Popover.Trigger class="bg-white relative m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-stone-500 border-black border">
      <span class="sr-only">Open menu</span>
      <svg class="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </Popover.Trigger>
    <Popover.Content>
    {#if user}
      <span class="hover:bg-gray-100">Sign Out</span>
    {:else}
      <a href="/auth/login">Login</a>
    {/if}
    </Popover.Content>
  </Popover.Root>
</div>