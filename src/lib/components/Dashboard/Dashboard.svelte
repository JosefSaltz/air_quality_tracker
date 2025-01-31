<script lang="ts">
  import type { PageProps } from "../../../routes/$types";
  import ReportMap from "$components/ReportMap/ReportMap.svelte";
  import { ReportForm, LoginRequired } from "$components/Forms/FormTypes/index";
  import type { User } from "@supabase/supabase-js";
  import { fromAbsolute } from "@internationalized/date";

  let { form, markers, user }: { form: PageProps["form"], markers?: PageProps["data"]["markers"], user: User | null } = $props();
  const initialView = {
    latitude: 38.10105120505375,
    longitude: -122.25144198851173
  }
  let currentGeolocation = $state(initialView);
  $effect(() => {
    if(!markers || !form) return;
    const awaitingMarker = !!(form?.success && form.newMarker);
    const readyForPush = !!(markers.at(-1)?.id !== form.newMarker[0].id)
    if(awaitingMarker && readyForPush) markers.push(form.newMarker[0])
  })
</script>

<div 
  id='dashboard'
  class={`
    w-full
    h-full
    justify-center
    items-center
  `}>

  <ReportMap bind:currentGeolocation markers={markers} form={form} initialView={initialView} user={user} />
</div>