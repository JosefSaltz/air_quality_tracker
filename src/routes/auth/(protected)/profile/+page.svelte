<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$components/ui/button/button.svelte";
  import type { PageProps } from "./$types"
  import PersonalInfo from "$components/Profile/PersonalInfo.svelte";
  import ExportData from "$components/Profile/ExportData.svelte";
  
  let { data }: PageProps  = $props();
  // QOL Role Check
  const isAdmin = data.profile?.is_admin || false;
  // Initialize personal info string values
  let [first_name, last_name, email]: string[] | null[] = ['', '', ''];
  // Update from user's profile if available
  if(data.profile) ({ first_name, last_name, email } = data.profile);
</script>

<div id="profile-container" class="w-full flex flex-col items-center">
  <div id="form-container" class="w-full max-w-xl p-4 md:p-8">
    <h1 class="w-full text-4xl md:text-5xl pb-8 pt-8 md:pt-16">Profile</h1>
    <!-- <form use:enhance method="POST" class="w-full space-y-4">
      <PersonalInfo { first_name } { last_name } { email }/>
      <div id="submit-changes" class="flex flex-col gap-2">
        <label for="submit">Save Profile Settings</label>
        <Button name="submit" type="submit" class="max-w-32" formaction="?/apply-settings">Save</Button>
      </div>
    </form> -->
    <ExportData { isAdmin } />
  </div>
</div>