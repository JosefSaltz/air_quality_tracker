<script lang="ts">
  import type { PageProps } from "./$types";
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";
  import { z, type ZodIssue } from 'zod';
  import Turnstile from "$components/Forms/Turnstile.svelte";
  import { type SubmitFunction } from "@sveltejs/kit";
  import { validPasswordSchema } from "@/lib/utils/zSchemas/validPasswordSchema";
  import LogoPiita from "$components/LogoPiita.svelte";

  const emailSchema = z.string().email();
  let { data }: PageProps = $props();
  let { googleNonce } = data;
  let confirm_pw = $state();
  let email = $state<string | null>(null);
  let password = $state<string | null>(null);
  let passwordErrors = $state<ZodIssue[] | undefined | null>(null)
  let first_name = $state(null);
  let last_name = $state(null);
  let cfResponse = $state<string | null>(null)
  let valid_email = $derived(emailSchema.safeParse(email).success);
  let verified_pw = $derived(password && confirm_pw && (password === confirm_pw));
  let disable_submit = $derived(!(verified_pw && valid_email && cfResponse));
  // Zod password validation
  const handlePasswordValidation = (password: string) => {
    const validatedPassword = validPasswordSchema.safeParse(password);
    passwordErrors = validatedPassword.error?.errors;
  }
  // Enhanced Form Action Handler
  const handleSubmit: SubmitFunction = ({ formData }: { formData: FormData }) => {
    cfResponse && formData.append('cf-turnstile-response', cfResponse)
  }
  $effect(() => {
    if(password) handlePasswordValidation(password);
  })
</script>

{#if browser}
  <script src="https://accounts.google.com/gsi/client" data-nonce={googleNonce} async></script>
{/if}

<div id="signup-form-container" class="w-full h-full flex flex-col justify-center">
  <!-- Logo and Header -->
  <LogoPiita name="Sign Up" />
  <!-- Sign Up Form Input -->
  <div class="sm:mx-auto sm:w-full sm:max-w-[480px]">
    <div class="bg-white px-6 py-12 sm:px-12">
      <form use:enhance={handleSubmit} class="" action="?/signup" method="POST">
        <!-- Email Input -->
        <div id="email-container">
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
        <!-- Password Inputs -->
        <div id="password-container">
          <!-- Password Input -->
          <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
          <div class="mt-2">
            <input type="password" name="password" bind:value={password} id="password" autocomplete="current-password" minlength=6 required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
          </div>
          <!-- Password Confirm -->
          <label for="confirm" class="block text-sm/6 font-medium text-gray-900">Verify Password</label>
          <div class="mt-2">
            <input type="password" name="confirm" bind:value={confirm_pw} id="confirm" autocomplete="current-password" minlength=6 required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
          </div>
        </div>
        <!-- Dynamic Validation Feedback -->
        {#if password && confirm_pw}
          {#if verified_pw}
            <p class="text-green-500">Passwords match</p>
          {:else}
            <p class="text-red-500">Passwords do not match</p>
          {/if}  
        {/if}
        {#if passwordErrors}
          {#each passwordErrors as error}
            <p class="text-red-500">{error.message}</p>
          {/each}
        {/if}
        <!-- Optional Values -->
        <div id="optionals-container">
          <label for="first_name" class="block text-sm/6 font-medium text-gray-900">First Name (Optional)</label>
          <div class="mt-2">
            <input type="first_name" name="first_name" id="first_name" bind:value={first_name} autocomplete="given-name" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
            <label for="last_name" class="block text-sm/6 font-medium text-gray-900">Last Name (Optional)</label>
            <input type="last_name" name="last_name" id="last_name" bind:value={last_name} autocomplete="family-name" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
          </div>
        </div>
        <!-- Submit Button -->
        <div>
          <button type="submit" disabled={disable_submit} class={`
            w-full rounded-md px-3 py-1.5 my-6 shadow-sm
            flex justify-center
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline--600 
            text-sm/6 font-semibold text-white 
            hover:bg--500  ${disable_submit ? 'bg-purple-200' : 'bg-purple-800'} 
          `}>
            Sign Up
          </button>
          <Turnstile bind:cfResponse className="flex justify-center items-center" />
        </div>
      </form>
      <p class="mt-10 text-center text-sm/6 text-gray-500">
        Already have an account?
        <a href="/auth/login" class="font-semibold text--600 hover:text--500">Login Here</a>
      </p>
    </div>
  </div>
</div>