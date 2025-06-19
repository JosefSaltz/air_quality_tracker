<script lang="ts">
  import DownloadButton from "$components/DownloadButton.svelte";
  import { fileDownload } from "$lib/utils/fileDownload";
  import Input from "../ui/input/input.svelte";
  
  let { isAdmin = false } = $props()
  // Style state toggled during click handler execution
  let downloading = $state(false)
  // Click handler for GET request to get a month of reports
  const handleClick = async () => {
    // Set the downloading state to true to change the button styles
    downloading = true;
    
    let response;

    if(isAdmin) {
      response = await fetch("api/download/reports", {
        method: "POST"
      })
    }
    else {
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
  <h2 class="text-xl">Reports Download</h2>
  <div class="flex flex-col gap-2">
    <label for="download-reports">Download reports as an Excel spreadsheet</label>
    {#if isAdmin}
      <Input type="text" required />
    {/if}
    <DownloadButton bind:downloading onclick={handleClick} name="download-reports" variant="secondary" />
  </div>
</div>