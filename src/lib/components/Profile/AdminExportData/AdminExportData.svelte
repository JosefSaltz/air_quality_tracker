<script lang="ts">
  import Button from "$components/ui/button/button.svelte";
  import Input from "$components/ui/input/input.svelte";
  let password = $state();

  const handleClick = async () => {
    const response = await fetch("/auth/profile/download-data", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });
    console.log(response);
  }
</script>

<div id="data-exports">
  <h2 class="text-xl">Admin Request Report Data</h2>
  <div class="flex flex-col gap-2">
    <label for="reports-password">Please set a password for the admin data download</label>
    <Input bind:value={password} type="text" name="reports-password" required />
    <label for="download-reports">Download Reports as an encrypted CSV file</label>
    <Button class="max-w-24" name="download-reports" onclick={handleClick}>Download</Button>
  </div>
</div>