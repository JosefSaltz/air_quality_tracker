<script lang="ts">
  import DownloadButton from "$components/DownloadButton.svelte";
  import { fileDownload } from "$lib/utils/fileDownload";
  import PasswordInputs from "$components/Forms/signup/PasswordInputs.svelte";
  import { validPasswordSchema } from "$zSchemas";
  import type { ZodIssue } from "zod";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  import { Switch } from "$components/ui/switch/index.js";
  import type { DateRange } from "bits-ui";
  import { getLocalTimeZone, today } from "@internationalized/date";
  import { innerWidth } from "svelte/reactivity/window";
  import Label from "$components/ui/label/label.svelte";

  let { isAdmin = false } = $props()
  let noData = $state(false);
  let password = $state<string | null>(null);
  let enablePasswordWarning = $state(false);
  const validatePassword = (pw?: string | null) => validPasswordSchema.safeParse(pw).error?.errors;
  let passwordErrors = $state<ZodIssue[] | null | undefined>();
  let enableEncrypt = $state(true);
  // Default calendar range values
  const currentDate = today(getLocalTimeZone());
  const defaultRange: DateRange = { end: currentDate, start: currentDate.subtract({ days: 30 }) };
  let timeRange = $state(defaultRange);
  let dateParams = $derived(`/?start_date=${timeRange.start}&end_date=${timeRange.end}`)
  // Password input change debounce effect
  $effect(() => {
    if(password) {
      const timer = setTimeout(() => { passwordErrors = validatePassword(password) }, 500);
      return () => timer && clearTimeout(timer);
    }
  })
  // Password confirmation input state
  let confirm_pw = $state();
  // Style state toggled during click handler execution
  let downloading = $state(false)
  // Click handler for GET request to get a month of reports
  const handleClick = async () => {
    // Initialize response for assignment depending on user privilege
    let response;
    // Reset the noData warning text while we check
    noData = false;
    // Admin privileged logic
    if(isAdmin && enableEncrypt) {
      // No Password guard
      if(!password) { [enablePasswordWarning, downloading] = [true, false];  return; }
      // Check password against schema for errors and short circuit if necessary
      const passwordCheck = validPasswordSchema.safeParse(password);
      // If we have errors, break and update state with the ZodIssue array
      if (passwordCheck.error) return passwordErrors = passwordCheck.error.errors
      // Set the downloading state to true to change the button styles
      downloading = true;
      // Send response with the validated password as the body
      response = await fetch(`/api/download/reports${dateParams}`, {
        method: "POST",
        body: JSON.stringify({
          password,
          timeRange
        })
      })
    }
    // Generic user reports logic
    else {
      // Set the downloading state to true to change the button styles
      downloading = true;
      response = await fetch(`/api/download/reports${dateParams}`, {
        method: "GET"
      });
    }
    // Error handling
    if(!response.ok) {
      console.error('Failed to download report data');
      return downloading = false;
    }
    const contentType = response.headers.get('content-type');
    if(contentType && contentType.includes('application/json')) {
      noData = true;
      downloading = false;
      return;
    }
    // Extract the blob data
    const blob = await response.blob();
    // Run the a tag workaround file download logic
    fileDownload(blob);
    // Set the downloading state to false to revert the button styles
    downloading = false;
  }

  const handleDownloadDisable = () => {
    if(!isAdmin || !enableEncrypt) return false;
    return !((password && confirm_pw) && !passwordErrors)
  }
</script>

<div id="data-exports">
  <h2 class="text-xl mb-6">{isAdmin ? 'Admin' : ''} Reports Download</h2>
  <div class="flex flex-col gap-8">
    {#if isAdmin}
      <!-- Encryption password input for admins -->
      {#if enableEncrypt}
        <div id="encrypt-password-container">
          <p>Please set a password to encrypt the file with before downloading</p>
          <PasswordInputs bind:password bind:confirm_pw { passwordErrors } />
        </div>
      {/if}
      <div id="encrypt-toggle-container" class="flex items-center gap-4">
        <Label for="encrypt-toggle" class="text-lg">Encrypt Workbook?</Label>
        <Switch id="encrypt-toggle" bind:checked={enableEncrypt} />
      </div>
    {/if}
    <div id="report-range-picker-container" class="">
      <p class="text-lg">Pick Date</p>
      <p>Select a date range (defaults to last 30 days)</p>
      <p class="text-sm italic">Note: Not all date ranges will produce data!</p>
      <RangeCalendar class="flex flex-col items-center md:block" numberOfMonths={innerWidth?.current && innerWidth.current <= 768 ? 1 : 2} bind:value={timeRange} />
      {#if noData} 
        <p class="text-red-500">No records found in that data range</p>
      {/if}
    </div>
    <DownloadButton disabled={handleDownloadDisable()} bind:downloading onclick={handleClick} name="download-reports" variant="secondary" class="" />
  </div>
</div>