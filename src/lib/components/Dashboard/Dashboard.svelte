<script lang="ts">
  import type { PageProps } from "../../../routes/$types";
  import type { Tables } from "$root/database.types.js";

  import ReportMap from "$components/ReportMap/ReportMap.svelte";
  import { ReportForm, LoginRequired } from "$components/Forms/FormTypes/index";
  import type { User } from "@supabase/supabase-js";

  let { form, markers, user }: { form: PageProps["form"], markers?: PageProps["data"]["markers"], user: User | null } = $props();
  const initialView = {
    latitude: 38.10105120505375,
    longitude: -122.25144198851173
  }
  let currentGeolocation = $state(initialView);
</script>

<div 
  id='dashboard'
  class={`
    flex 
    flex-col-reverse
    w-full
    h-full
    xl:flex-row-reverse
    xl:w-2/3 
    xl:h-auto
    justify-center
    items-center
  `}>
  {#if user}
    <ReportForm bind:currentGeolocation form={form} />
  {:else}
    <LoginRequired />
  {/if}
  <ReportMap bind:currentGeolocation markers={markers} initialView={initialView} />
</div>