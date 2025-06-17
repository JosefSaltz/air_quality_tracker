<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$components/ui/button/button.svelte";
  import type { PageProps } from "./$types"
  import PersonalInfo from "$components/Profile/PersonalInfo/PersonalInfo.svelte";
  import ExportData from "$components/Profile/ExportData/ExportData.svelte";
  import AdminExportData from "$components/Profile/AdminExportData/AdminExportData.svelte";
  let { data }: PageProps  = $props();
  let [first_name, last_name, email ]: string[] | null[] = ['', '', '']
  if(data.profile) ({ first_name, last_name, email } = data.profile);

</script>

<div class="w-full flex flex-col items-center p-8">
  <h1 class="text-3xl md:text-5xl mb-8">Profile</h1>
  <form use:enhance method="POST" class="space-y-4">
    <PersonalInfo { first_name } { last_name } { email }/>
    <ExportData />
    {#if data.user?.role === "admin"}
      <AdminExportData />
    {/if}
    <div id="submit-changes" class="flex flex-col gap-2">
      <label for="submit">Apply Settings</label>
      <Button name="submit" type="submit" class="max-w-24" formaction="?/apply-settings">Update</Button>
    </div>
  </form>
</div>