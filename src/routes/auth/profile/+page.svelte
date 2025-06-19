<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$components/ui/button/button.svelte";
  import type { PageProps } from "./$types"
  import PersonalInfo from "@/lib/components/Profile/PersonalInfo.svelte";
  import ExportData from "@/lib/components/Profile/ExportData.svelte";
  import AdminExportData from "@/lib/components/Profile/AdminExportData.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  let { data, form }: PageProps  = $props();

  let [first_name, last_name, email ]: string[] | null[] = ['', '', '']
  if(data.profile) ({ first_name, last_name, email } = data.profile);
  const handleSubmit: SubmitFunction = ({}) => {}
</script>

<div id="profile-container" class="w-full flex flex-col items-center">
  <div id="form-container" class="w-full max-w-xl p-4 md:p-8">
    <h1 class="w-full text-5xl py-16">Profile</h1>
    <form use:enhance={handleSubmit} method="POST" class="w-full space-y-4">
      <PersonalInfo { first_name } { last_name } { email }/>
      <ExportData />
      {#if data.user?.role === "admin"}
        <AdminExportData />
      {/if}
      <div id="submit-changes" class="flex flex-col gap-2">
        <label for="submit">Apply Settings</label>
        <Button name="submit" type="submit" class="max-w-24" formaction="?/apply-settings">Save</Button>
      </div>
    </form>
    </div>
</div>