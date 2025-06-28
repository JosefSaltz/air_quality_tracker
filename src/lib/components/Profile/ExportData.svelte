<script lang="ts">
  import DownloadButton from "$components/DownloadButton.svelte";
  import { fileDownload } from "$lib/utils/fileDownload";
  import PasswordInputs from "$components/Forms/signup/PasswordInputs.svelte";
  import { validPasswordSchema } from "$zSchemas";
  import type { SafeParseError, ZodIssue } from "zod";
  
  let { isAdmin = false } = $props()
  let password = $state<string | null>(null);
  let enablePasswordWarning = $state(false);
  const validatePassword = (pw?: string | null) => validPasswordSchema.safeParse(pw).error?.errors;
  
  let passwordErrors = $state<ZodIssue[] | null | undefined>();
  
  $effect(() => {
    if(password) {
      const timer = setTimeout(() => { passwordErrors = validatePassword(password) }, 500);
      return () => timer && clearTimeout(timer);
    }
  })

  let confirm_pw = $state();
  // Style state toggled during click handler execution
  let downloading = $state(false)
  // Click handler for GET request to get a month of reports
  const handleClick = async () => {
    // Initialize response for assignment depending on user privilege
    let response;
    // Admin privileged logic
    if(isAdmin) {
      // No Password guard
      if(!password) { [enablePasswordWarning, downloading] = [true, false];  return; }
      // Check password against schema for errors and short circuit if necessary
      const passwordCheck = validPasswordSchema.safeParse(password);
      // If we have errors, break and update state with the ZodIssue array
      if (passwordCheck.error) return passwordErrors = passwordCheck.error.errors
      // Set the downloading state to true to change the button styles
      downloading = true;
      // Send response with the validated password as the body
      response = await fetch("/api/download/reports", {
        method: "POST",
        body: JSON.stringify({
          password
        })
      })
    }
    // Generic user reports logic
    else {
      // Set the downloading state to true to change the button styles
      downloading = true;
      response = await fetch("/api/download/reports", {
        method: "GET"
      });
    }
    // Error handling
    if(!response.ok) throw new Error('Error downloading file');
    // Extract the blob data
    const blob = await response.blob();
    // Run the a tag workaround file download logic
    fileDownload(blob);
    // Set the downloading state to false to revert the button styles
    downloading = false;
  }
</script>

<div id="data-exports">
  <h2 class="text-xl">{isAdmin ? 'Admin' : ''} Reports Download</h2>
  <div class="flex flex-col gap-2">
    <label for="download-reports">Download reports as an Excel spreadsheet</label>
    {#if isAdmin}
      <p>Please set a password to encrypt the file with before downloading</p>
      <PasswordInputs bind:password bind:confirm_pw { passwordErrors } />
    {/if}
    <DownloadButton disabled={!((password && confirm_pw) && !passwordErrors)} bind:downloading onclick={handleClick} name="download-reports" variant="secondary" />
  </div>
</div>