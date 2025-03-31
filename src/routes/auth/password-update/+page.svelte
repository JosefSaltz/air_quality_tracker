<script lang="ts">
  import { enhance } from "$app/forms";
  import LogoPiita from "$lib/components/LogoPiita.svelte";
  import { validPasswordSchema } from "@/lib/utils/zSchemas/validPasswordSchema";
  import type { ZodIssue } from "zod";
  
  let password = $state(null);
  let confirm_pw = $state(null);
  let valid_pw = $state(false);
  let verified_pw = $derived(password && confirm_pw && (password === confirm_pw));
  let passwordErrors = $state<ZodIssue[] | null>(null);

  $effect(() => {
    if(password)  {
      const { error, success } = validPasswordSchema.safeParse(password);
      if(error) passwordErrors = error?.errors || null;
      if(success) valid_pw = true;
    }
  })
</script>

<div id="password-reset-container" class="w-ful h-full flex flex-col justify-center items-center">
  <!-- Logo and Header -->
  <LogoPiita name="Change Password"/>
  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
    <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
      <form use:enhance class="space-y-6" action="?/password-update" method="POST">
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
        <!-- Submit Button -->
        <div>
          <button type="submit" disabled={!valid_pw} formaction="?/password-update" class={`flex w-full justify-center rounded-md ${valid_pw ? 'bg-purple-500' : 'bg-purple-200'} px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg--500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline--600`}>Submit</button>
        </div>
      </form>
    </div>
  </div>
</div>