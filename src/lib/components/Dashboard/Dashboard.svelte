<script lang="ts">
  import type { PageProps } from "../../../routes/$types";
  import ReportMap from "$components/ReportMap/ReportMap.svelte";
  import type { User } from "@supabase/supabase-js";
  let { form, user, markers }: { form: PageProps["form"], markers: PageProps["data"]["markers"], user: User | null } = $props();
</script>

<div 
  id='dashboard'
  class={`
    w-full
    h-full
    justify-center
    items-center
  `}>

  <ReportMap markers={markers} form={form}  user={user} />
</div>