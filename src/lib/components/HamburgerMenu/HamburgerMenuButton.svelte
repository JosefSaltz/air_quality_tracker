<script lang="ts">
  import type { PageProps } from "../../../routes/$types";
  import * as Popover from "$components/ui/popover";
  import defaultAvatar from "$lib/assets/defaultAvatar.png"
  
  type Props = {
    user: PageProps["data"]["user"], 
    profile: PageProps["data"]["profile"], 
    supabase: PageProps["data"]["supabase"],
    class?: string
  }

  let { user, profile, supabase, class: className = "" }: Props = $props();

  //let toggleMenu = () => { menuOpen = !menuOpen };
  const handleSignOut = async () => { 
    const { error } = await supabase.auth.signOut();
    error && console.error(error); 
    location.reload();
  }
</script>

<div id="mobile-menu-button" class={`relative z-500 ${className}`}>
  <Popover.Root>
    <Popover.Trigger class="bg-white relative mx-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-stone-500 border-black border">
      <span class="sr-only">Open menu</span>
      <svg class="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </Popover.Trigger>
    <Popover.Content>
      <nav>
        <div class="relative text-lg flex flex-col z-1000 space-y-2">
          {#if user}
            <a href="/auth/profile" class="w-full flex items-center menu-entry">
              <img class="size-5 mr-2 rounded-full" src={ user.user_metadata.avatar_url ?? defaultAvatar } alt="user-profile-avatar" referrerpolicy="no-referrer">
              { profile?.first_name ? profile.first_name : 'Profile' }
            </a>
            <button class="w-full menu-entry text-start" onclick={handleSignOut}>Logout</button>
          {:else}
            <a href="/auth/login" class="menu-entry">Login</a>
          {/if}
          <a href="/support" class="menu-entry">Help</a>
        </div>
      </nav>
    </Popover.Content>
  </Popover.Root>
</div>

<style>
  .menu-entry {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    text-decoration: none !important;
  }

  .menu-entry:hover {
    /* Tailwind bg-gray-100 utility class */
    --tw-bg-opacity: 1;
    background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));
  }
</style>