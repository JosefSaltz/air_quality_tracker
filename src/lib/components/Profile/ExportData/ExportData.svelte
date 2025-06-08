<script lang="ts">
  import Button from "$components/ui/button/button.svelte";
  let { handleClick } = $props();
</script>

<div id="data-exports">
  <h2 class="text-xl">Request Report Data</h2>
  <div class="flex flex-col gap-2">
    <label for="download-reports">Download Reports as a CSV file</label>
    <Button class="max-w-24" name="download-reports" onclick={handleClick}>Download</Button>
  </div>
</div>