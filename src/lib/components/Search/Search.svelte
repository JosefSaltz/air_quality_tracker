<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Input from "$components/ui/input/input.svelte";
  import { parseTimeOperators } from "@/lib/utils/parseTimeOperators";
  import { onMount } from "svelte";
  
  let { class: className = '', id = ''} = $props();
  // Define state to using existing params if they exist or default to undefined
  let searchValue = $state<string | undefined>(page.url.searchParams.get('search') || '');
  
  // Lifecycle function to overload the 
  // initialized search input with an existing param
  onMount(() => {
    // Create a Search Params interface from current page state
    const params = new URLSearchParams(page.url.searchParams.toString());
    // Overload the searchValue if there's already a search param present
    if(params.get('search')) searchValue = params.get('search') || undefined;
  })

  $effect(() => {
    // Create a Search Params interface from current page state
    const params = new URLSearchParams(page.url.searchParams.toString());
    // Check if the user wrote before and after search operators
    const { beforeDate, afterDate } = parseTimeOperators(searchValue);
    // If we have a before or after operator set the time to custom
    if(beforeDate || afterDate) params.set('time', 'custom');
    // Add a before or after operator params to the string
    if(beforeDate) params.set('before', beforeDate);
    if(afterDate) params.set('after', afterDate);
    // If there's a search value and it doesn't equal the current search paramter
    if(searchValue && searchValue !== params.get('search')) params.set('search', searchValue);
    // Debounce Search Input and parse relevant parameters
    const debounceAndParseInput = setTimeout(() => {
      // Make a copy of the old URL params
      const oldParams = new URLSearchParams(page.url.searchParams.toString());
      // If the current params object doesn't match the current page state update it
      if(oldParams.toString() !== params.toString()) goto('/?' + params, { keepFocus: true });
    }, 300)
    // Clean up function to clear the timeout
    return () => {
      clearTimeout(debounceAndParseInput); 
    }
  })
</script>

<Input id={id} class={className} bind:value={searchValue} autocomplete={'off'} />

