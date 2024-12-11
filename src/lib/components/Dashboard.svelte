<script>
  import { onMount } from "svelte";
  import LoginForm from "$components/Forms/FormTypes/LoginForm.svelte";
  import ReportMap from "$components/ReportMap.svelte";
  import ReportForm from "$components/Forms/FormTypes/ReportForm.svelte";

  const getDeviceType = () => false;
  // True: Mobile, False: Desktop
  let { data: userLoggedIn } = $props()
  let onMobile = $state(getDeviceType());
  const handleClick = () => { console.log('Submit Form Data') }
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
  {#if userLoggedIn}
    <ReportForm handleClick={handleClick} />
  {:else}
    <LoginForm handleClick={handleClick} />
  {/if}
</div>