<script lang="ts">
  import type { PageData } from "../../../routes/$types.js";
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import ReportMap from "@/lib/components/Dashboard/ReportMap.svelte";
  import { LoginForm, ReportForm, SignUpForm, LoginRequired } from "$components/Forms/FormTypes/index";
  let { data, markers }: { data?: PageData, markers: any[] } = $props();
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
  {#if data?.user}
    <ReportForm handleClick={handleClick} />
  {:else}
    <LoginRequired />
  {/if}
  <ReportMap markers={data?.markers} />
</div>