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

  const handleMenuClick = (cb?: () => any) => {
    cb && cb();
  }
</script>

<header class={`${page.route.id === '/' ? 'hidden lg:block' : ''} bg-white shadow-sm md:static lg:overflow-y-visible`}>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">
      <div class="flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-2">
        <div class="flex shrink-0 items-center">
          <a href="/" class={`${buttonVariants({ ...buttonConfig, variant: "link"})}`}>
            <!-- <span>{ HomeLogo }</span> -->
            Home
          </a>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6 invisible">
        <div class="flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
          <div class="grid w-full grid-cols-1">
            <input type="search" name="search" class="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-stone-600 sm:text-sm/6" placeholder="Search">
            <svg class="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
              <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Desktop Profile Button -->
      <div id="profile-container" class={`${menuOpen ? '' : 'hidden'} lg:flex lg:items-center lg:justify-end xl:col-span-4`}> 
        <div id="profile-dropdown" class="relative ml-5 shrink-0">
          <div class="flex row justify-evenly">
            {#if user}
              <span >{profile?.first_name ?? ""}</span>
              <button onclick={toggleMenu} type="button" class="relative flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                <img class="size-8 rounded-full" src={ user.user_metadata.avatar_url ?? defaultAvatar } alt="">
              </button>
            {:else}
              <a href="/auth/login" class={`${buttonVariants({ ...buttonConfig, variant: "outline" })}`}>Login</a>
            {/if}
          </div>
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
    </div>
  </div>
</header>
