<script lang="ts">
  import type { PageData } from "../../routes/$types.js";
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import ReportMap from "$components/ReportMap.svelte";
  import { LoginForm, ReportForm, SignUpForm, LoginRequired } from "$components/Forms/FormTypes/index";

  let { data }: { data?: PageData } = $props();
  let authParams = $state(new URLSearchParams());
  const handleClick = () => { console.log('Submit Form Data') };
  const updateAuthParams = () => { authParams = new URLSearchParams(window.location.search) };
  // Initialize the state client-side
  onMount(updateAuthParams);
  // Update it after navigation
  afterNavigate(updateAuthParams) 
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
  <ReportMap />
</div>