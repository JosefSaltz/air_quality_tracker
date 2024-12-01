<script>
  import { onMount } from "svelte";
  import LoginForm from "./LoginForm.svelte";
  import ReportMap from "./ReportMap.svelte";
  import ReportForm from "./ReportForm/ReportForm.svelte";
  import supabase from "@/lib/utils/client";

  const getDeviceType = () => false;
  // True: Mobile, False: Desktop
  let onMobile = $state(getDeviceType());
  let userLoggedIn = $state();

  onMount(async () => {
    userLoggedIn = supabase.auth.getUser();
  }) 
</script>

<div 
  class={`
    flex ${ onMobile ? 'flex-col' : 'flex-row'} 
    justify-center 
    max-w-2/3`
    } 
  id='dash-layout
'>
  <ReportMap />
  <!-- {#if userLoggedIn} -->
  <ReportForm />
  <!-- {:else}
    <LoginForm />
  {/if} -->
</div>