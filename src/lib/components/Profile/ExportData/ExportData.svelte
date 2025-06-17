<script lang="ts">
  import Button from "$components/ui/button/button.svelte";

  const handleClick = async () => {
    const response = await fetch("/auth/profile/download-data", {
      method: "GET"
    })
    console.log(response);
  }
  // Current date string generation helper
  const mm_dd_yyyy = () => new Date().toLocaleDateString();
</script>

<div id="data-exports">
  <h2 class="text-xl">Request Report Data</h2>
  <div class="flex flex-col gap-2">
    <label for="download-reports">Download Reports as a CSV file</label>
    <Button class="max-w-24" name="download-reports" href="/auth/profile/download-data" download={`reports_${mm_dd_yyyy()}`}>Download</Button>
  </div>
</div>