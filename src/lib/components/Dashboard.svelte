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
    flex 
    flex-col
    flex-
    xl:flex-row-reverse
    justify-center
    items-center
    w-full
    h-full
    xl:h-auto
    xl:w-2/3  
  `} 
  id='dash-layout
'>
  {#if userLoggedIn}
    <ReportForm handleClick={handleClick} />
  {:else}
    <LoginForm handleClick={handleClick} />
  {/if}
  <ReportMap />
</div>