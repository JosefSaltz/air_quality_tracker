<!--
  When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars

  Open: "fixed inset-0 z-40 overflow-y-auto", Closed: ""
-->
<script lang="ts">
  import type { SupabaseClient, User } from "@supabase/supabase-js";
  import type { ProfileResponse } from "@/routes/+layout.server";
  import { buttonVariants } from "$lib/components/ui/button";
  import { page } from "$app/state";
  import Search from "$components/Search/Search.svelte";
  import TimeSelect from "$components/Search/TimeSelect.svelte";
  import { innerWidth } from "svelte/reactivity/window";
  import HamburgerMenuButton from "$components/HamburgerMenu/HamburgerMenuButton.svelte";

  type NavbarProps = { 
    profile: ProfileResponse
    user: User | null, 
    supabase: SupabaseClient<any, 'public', any>
  };
  
  let { user, profile, supabase }: NavbarProps = $props();
  let menuOpen = $state(false);
  const buttonConfig = { class: `text-lg`};

  let toggleMenu = () => { menuOpen = !menuOpen };
  
  const handleSignOut = async () => { 
    const { error } = await supabase.auth.signOut();
    error && console.error(error); 
    location.reload();
  }

  const isOnMapPage = () => {
    return page.url.pathname === "/"
  }

  const handleMenuClick = (cb?: () => any) => {
    cb && cb();
  }
</script>

<header class={`${page.route.id === '/' ? 'hidden' : ''} bg-white shadow-sm md:static md:block lg:overflow-y-visible py-1`}>
  <div id="centering-container" class="w-full flex justify-center">
    <div id="grid-container" class="w-full md:max-w-4xl grid grid-cols-12">
      <!-- Home Button -->
      <div id="home-button-container" class="col-span-4 md:col-span-2">
        <a href="/" class={`${buttonVariants({ ...buttonConfig, variant: "link"})}`}>
          PIITA
        </a>
      </div>
      <!-- Search Bar -->
      <!-- Only render when the display size is larger than our medium breakpoint -->
      {#if innerWidth?.current && innerWidth?.current >= 768}
        <div id="searchbar-container" class={`w-full col-span-8 flex justify-center`}>
          {#if isOnMapPage()}
            <TimeSelect />
            <Search class="w-full max-w-[80ch]" />
          {/if}
        </div>
      {/if}
      <HamburgerMenuButton class="col-start-11 col-end-13" user={user} profile={profile} supabase={supabase} />
    </div>
  </div>
</header>