<script lang="ts">
  import Button from "$components/ui/button/button.svelte";
  import Input from "$components/ui/input/input.svelte";
</script>

<div id="data-exports">
  <h2 class="text-xl">Admin Request Report Data</h2>
  <div class="flex flex-col gap-2">
    <label for="reports-password">Please set a password for the admin data download</label>
    <Input type="text" name="reports-password" required />
    <label for="download-reports">Download Reports as an encrypted CSV file</label>
    <Button class="max-w-24" name="download-reports" formaction="?/admin-request-reports">Download</Button>
  </div>
</div>