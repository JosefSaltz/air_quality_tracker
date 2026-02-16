<script lang="ts">
  import { enhance } from "$app/forms";
  import LogoPiita from "@/lib/components/LogoPiita.svelte";
  import Turnstile from "$components/Forms/Turnstile.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import type { PageProps } from "./$types";
  import LoginEmailInput from "$components/Forms/Login/LoginEmailInput.svelte";
  import LoginPasswordInput from "@/lib/components/Forms/Login/LoginPasswordInput.svelte";
  import GoogleSingleSignOn from "@/lib/components/Forms/Login/GoogleSingleSignOn.svelte";
  import RememberMeCheckBox from "@/lib/components/Forms/Login/RememberMeCheckBox.svelte";
  
  let { form }: PageProps = $props();

  let cfResponse = $state<string | null>(null);
  const disabled = $derived(!cfResponse);

  const handleSubmit: SubmitFunction = ({ formData }: { formData: FormData}) => {
    if(cfResponse) formData.append('cf-turnstile-response', cfResponse)
  }
</script>

<div id="login-form-container" class="h-full flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-[480px]">
  <!-- Logo and Header -->
  <LogoPiita class="flex flex-col items-center" name="Login" />
  <div id="login-form-container" class="bg-white px-6 sm:px-12  sm:rounded-lg">
    <form use:enhance={handleSubmit} class="space-y-1 md:space-y-2" action="?/login" method="POST">
      <LoginEmailInput />
      <LoginPasswordInput />
      <!-- Remember Me Check Box -->
      <div id="inline-rememberme-forgotpw" class="flex items-center justify-between">
        <RememberMeCheckBox />
        <!-- Forgot Password Subtitle -->
        <div class="text-sm/6">
          <a href="/auth/password-reset" class="font-semibold text--600 hover:text--500">Forgot password?</a>
        </div>
      </div>
      {#if form?.code === "error"} 
        <p class="text-red-500">{form.message}</p>
      {/if}
      <!-- Email Form Submit -->
      <div>
        <button type="submit" disabled={disabled} class={`flex w-full justify-center rounded-md ${cfResponse ? 'bg-purple-800' : 'bg-purple-200'} px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg--500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline--600`}>Login</button>
      </div>
      <Turnstile bind:cfResponse class="flex justify-center items-center" />
      <!-- SSO Separator -->
      <div id="sso-container">
        <div id="separator-container" class="relative hidden md:block">
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm/6 font-medium">
            <span class="bg-white px-6 text-gray-900">Or continue with</span>
          </div>
        </div>
        <!-- Google Social Sign In -->
        <GoogleSingleSignOn class="grid grid-cols-1 gap-4" />
      </div>     
    </form>
  </div>

  <p class="lg:mt-10 text-center text-sm/6 text-gray-500">
    Need an account?
    <a href="/auth/signup" class="font-semibold text--600 hover:text--500">Click here</a>
  </p>
</div>
