<!--
  When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars

  Open: "fixed inset-0 z-40 overflow-y-auto", Closed: ""
-->
<script lang="ts">
  import type { SupabaseClient, User } from "@supabase/supabase-js";
  import type { ProfileResponse } from "@/routes/+layout.server";
  import { buttonVariants } from "$lib/components/ui/button";
  import defaultAvatar from "$lib/assets/defaultAvatar.png"
  import { page } from "$app/state";
  import Search from "$components/Search/Search.svelte";
  import TimeSelect from "$components/Search/TimeSelect.svelte";
  import { innerWidth } from "svelte/reactivity/window";
  
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
    <div id="grid-container" class="w-full max-w-[80vw] grid grid-cols-12">
      <div id="home-button-container" class="col-span-2">
        <a href="/" class={`${buttonVariants({ ...buttonConfig, variant: "link"})}`}>
          <!-- <span>{ HomeLogo }</span> -->
          Home
        </a>
      </div>
      <!-- Search Bar -->
      {#if innerWidth?.current && innerWidth?.current > 768}
        <div id="searchbar-container" class={`w-full col-span-8 flex justify-center`}>
          {#if isOnMapPage()}
            <TimeSelect />
            <Search class="w-full max-w-[80ch]" />
          {/if}
        </div>
      {/if}
      <!-- Desktop Profile Button -->
      <div id="profile-container" class={'col-span-1 justify-self-end px-8'}> 
        <div id="profile-dropdown" class="relative ml-5 shrink-0">
          {#if user}
            <span >{profile?.first_name ?? ""}</span>
            <button onclick={toggleMenu} type="button" class="relative flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
              <img class="size-8 rounded-full" src={ user.user_metadata.avatar_url ?? defaultAvatar } alt="">
            </button>
          {:else}
            <a href="/auth/login" class={`${buttonVariants({ ...buttonConfig, variant: "outline" })}`}>Login</a>
          {/if}

          <!--
            Dropdown menu, show/hide based on menu state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          -->
          <div class={`${menuOpen ? 'bg-gray-100 outline-none' : 'hidden' } absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none `} role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
            <!-- Active: "bg-gray-100 outline-none", Not Active: "" -->
            <a href="profile/settings" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-1">Settings</a>
            <a href="/" onclick={() => {handleMenuClick(handleSignOut)}} class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</a> 
          </div>
        </div>
      </div>
      <div id="support-button-container" class="col-span-1">
        <a href="/support" class={`${buttonVariants({ ...buttonConfig, variant: "link"})}`}>
          <!-- <span>{ HomeLogo }</span> -->
          Help
        </a>
      </div>
    </div>
  </div>
</header>
