<script lang="ts">
  import LogoPiita from "@/lib/components/LogoPiita.svelte";
  import { z } from "zod";
  let email = $state(null);
  const emailSchema = z.string().email();
  let validEmail = $derived(emailSchema.safeParse(email).success);
</script>

<div id="password-reset-container" class="w-ful h-full flex flex-col justify-center items-center">
  <!-- Logo and Header -->
  <LogoPiita name="Resend Verification"/>
  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
    <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
      <form class="space-y-6" action="?/resend-verification" method="POST">
        <!-- Email Input -->
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
          <div class="mt-2">
            <input type="email" name="email" id="email" bind:value={email} autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
          </div>
        </div>
        <!-- Email Validation Subtitle -->
        {#if email}
          {#if validEmail}
            <p class="text-green-500">Valid Email</p>
            {:else}
            <p class="text-red-500">Invalid Email</p>
          {/if}
        {/if}
        <!-- Navigate back to Login -->
        <div class="flex items-center justify-right">
          <div class="text-sm/6">
            <a href="/auth/login" class="font-semibold text--600 hover:text--500">🔙 to Login</a>
          </div>
        </div>
        <!-- Submit Button -->
        <div>
          <button type="submit" disabled={!validEmail} formaction="?/resend-verification" class={`flex w-full justify-center rounded-md ${validEmail ? 'bg-purple-500' : 'bg-purple-200'} px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg--500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline--600`}>Send email</button>
        </div>
      </form>
    </div>
  </div>
</div>