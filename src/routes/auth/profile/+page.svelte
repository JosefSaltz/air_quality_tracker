<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$components/ui/button/button.svelte";
  import type { PageProps } from "./$types"
  import PersonalInfo from "$components/Profile/PersonalInfo/PersonalInfo.svelte";
  import ExportData from "$components/Profile/ExportData/ExportData.svelte";
  let { data }: PageProps  = $props();
  const { first_name, last_name, email } = data.profile;
  const handleDataDownload = () => {

  }

</script>

<div class="p-8">
  <h1 class="text-3xl md:text-5xl mb-8">Profile</h1>
  <form use:enhance method="POST" class="space-y-4">
    <PersonalInfo { first_name } { last_name } { email }/>
    <ExportData handleClick={handleDataDownload} />
    <div id="submit-changes" class="flex flex-col gap-2">
      <label for="submit">Apply Settings</label>
      <Button name="submit" type="submit" class="max-w-24">Update</Button>
    </div>
  </form>
</div>