<!--
  When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars

  Open: "fixed inset-0 z-40 overflow-y-auto", Closed: ""
-->
<script lang="ts">

  import type { SupabaseClient, User } from "@supabase/supabase-js";
  import type { ProfileResponse } from "@/routes/+layout.server";
  import { buttonVariants } from "$lib/components/ui/button";
  import defaultAvatar from "$lib/assets/defaultAvatar.png"

  
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

<header class="bg-white shadow-sm md:static lg:overflow-y-visible hidden xl:block">
  <div class="hidden lg:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
  <!-- Mobile Navbar -->
  <div class="flex items-center md:absolute py-3 md:inset-y-0 md:right-0 lg:hidden">
    <a href="/" class={`text-lg ${buttonVariants({ variant: "outline"})} ml-3 py-2 hover:bg-red-500`}>Home</a>
    {#if user}
      
      <button type="button" onfocus={toggleMenu} onfocusout={toggleMenu} class="relative -mx-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-stone-500" aria-expanded="false">
        <span class="absolute -inset-0.5"></span>
        <span class="sr-only">Open menu</span>
        <!--
          Icon when menu is closed.

          Menu open: "hidden", Menu closed: "block"
        -->
        <svg class="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <!--
          Icon when menu is open.

          Menu open: "block", Menu closed: "hidden"
        -->
        <svg class="hidden size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    {/if}
  </div>
  <!-- Mobile menu, show/hide based on menu state. -->
  <nav class={`${menuOpen ? '' : 'hidden'} lg:hidden`} aria-label="Global">
    <div class="mx-auto max-w-3xl space-y-1 px-2 pb-3 pt-2 sm:px-4">
      <!-- Current: "bg-gray-100 text-gray-900", Default: "hover:bg-gray-50" -->
      <a href="/" aria-current="page" class="block rounded-md bg-gray-100 px-3 py-2 text-base font-medium text-gray-900">Dashboard</a>
    </div>
    <div class="border-t border-gray-200 pb-3 pt-4">
      <div class="mx-auto flex max-w-3xl items-center px-4 sm:px-6">
        <div class="shrink-0">
          <img class="size-10 rounded-full" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
        </div>
        <div class="ml-3">
          <div class="text-base font-medium text-gray-800">{profile?.first_name}</div>
          <div class="text-sm font-medium text-gray-500">{profile?.email}</div>
        </div>
        <button type="button" class="relative ml-auto shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2">
          <span class="absolute -inset-1.5"></span>
          <span class="sr-only">View notifications</span>
          <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        </button>
      </div>
      <div class="mx-auto mt-3 max-w-3xl space-y-1 px-2 sm:px-4" onfocusout={toggleMenu}>
        <a href="profile" class="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">Your Profile</a>
        <a href="profile/settings" class="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">Settings</a>
        <a href="/" onclick={() => { handleMenuClick(handleSignOut) }} class="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">Sign out</a>
      </div>
    </div>
  </nav>
</header>
