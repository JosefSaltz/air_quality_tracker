<script lang="ts">
  import type { PageData } from "../../../routes/$types.js";
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import ReportMap from "$components/ReportMap/ReportMap.svelte";
  import { LoginForm, ReportForm, SignUpForm, LoginRequired } from "$components/Forms/FormTypes/index";
  import type { User } from "@supabase/supabase-js";
  let { data, markers, user }: { data?: PageData, markers: any[], user?: User | null } = $props();
  const handleClick = () => { console.log('Submit Form Data') };
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
    <ReportForm handleClick={handleClick} />
  {:else}
    <LoginRequired />
  {/if}
  <ReportMap markers={data?.markers} />
</div>