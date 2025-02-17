<script lang="ts">
  import { browser } from "$app/environment";
  import { z } from 'zod';

  const emailSchema = z.string().email();
  let { googleNonce } = $props();
  let confirm_pw = $state();
  let email = $state();
  let password = $state();
  let first_name = $state(null);
  let last_name = $state(null);
  let valid_email = $derived(emailSchema.safeParse(email).success);
  let verified_pw = $derived(password && confirm_pw && password === confirm_pw);
  let disable_submit = $derived(!(verified_pw && valid_email));
</script>

{#if browser}
  <script src="https://accounts.google.com/gsi/client" data-nonce={googleNonce} async></script>
{/if}

<div class="sm:mx-auto sm:w-full sm:max-w-md">
  <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=&shade=600" alt="Your Company">
  <h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">New User Sign Up</h2>
</div>

<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
  <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
    <form class="space-y-6" action="?/signup" method="POST">
      <div>
        <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
        <div class="mt-2">
          <input type="email" name="email" id="email" bind:value={email} autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
        </div>
        {#if email}
          {#if valid_email}
            <p class="text-green-500">Valid email</p>
          {:else}
            <p class="text-red-500">Not a valid email address</p>
          {/if}  
        {/if}
      </div>

      <div>
        <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
        <div class="mt-2">
          <input type="password" name="password" bind:value={password} id="password" autocomplete="current-password" minlength=6 required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
        </div>

        <label for="confirm" class="block text-sm/6 font-medium text-gray-900">Verify Password</label>
        <div class="mt-2">
          <input type="password" name="confirm" bind:value={confirm_pw} id="confirm" autocomplete="current-password" minlength=6 required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
        </div>
      </div>
      
      {#if password && confirm_pw}
        {#if verified_pw}
          <p class="text-green-500">Passwords match</p>
        {:else}
          <p class="text-red-500">Passwords do not match</p>
        {/if}  
      {/if}
      <div>
        <label for="first_name" class="block text-sm/6 font-medium text-gray-900">First Name (Optional)</label>
        <div class="mt-2">
          <input type="first_name" name="first_name" id="first_name" bind:value={first_name} autocomplete="given-name" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
          <label for="last_name" class="block text-sm/6 font-medium text-gray-900">Last Name (Optional)</label>
          <input type="last_name" name="last_name" id="last_name" bind:value={last_name} autocomplete="family-name" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
        </div>
      </div>
      <div>
        <button type="submit" class={`flex w-full justify-center rounded-md ${disable_submit ? 'bg-stone-300' : 'bg-stone-600'} px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg--500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline--600`} disabled={disable_submit}>Sign up</button>
      </div>
    </form>
    <p class="mt-10 text-center text-sm/6 text-gray-500">
      Already have an account?
    <a href="/auth/login" class="font-semibold text--600 hover:text--500">Login Here</a>
    </p>
  </div>
</div>
