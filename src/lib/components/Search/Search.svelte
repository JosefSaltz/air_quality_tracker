<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Input from "$components/ui/input/input.svelte";
  import { onMount } from "svelte";
  // Namespace coercing props
  let { class: className = '', id = ''} = $props();
  // Define state to using existing params if they exist or default to undefined
  let searchValue = $state<string | undefined>(undefined);
  // Lifecycle function to overload the 
  // initialized search input with an existing param
  onMount(() => {
    // Create a Search Params interface from current page state
    const params = new URLSearchParams(page.url.searchParams.toString());
    // Overload the searchValue if there's already a search param present
    searchValue = params.get('search') || undefined;
  })

  $effect(() => {
    // Create a Search Params interface from current page state
    const { pathname } = page.url;
    const oldParams = page.url.searchParams.toString();
    const newParams = new URLSearchParams(oldParams);
    const searchParam = newParams.get('search');
    // If params and searchValue desynced and searchValue isn't just undefined
    if (searchValue !== searchParam && searchValue !== undefined) {
      // If it was an empty string, delete the param entirely
      if(searchValue === '') newParams.delete('search');
      // Otherwise set the new param value
      else newParams.set('search', searchValue);
    }
    if(pathname !== "/") return;
    // Debounce Search Input and parse relevant parameters
    const debounceAndParseInput = setTimeout(() => {
      // If the current params object doesn't match the current page state update it
      if(oldParams !== newParams.toString()) goto(`/?${newParams}`, { keepFocus: true, replaceState: true });
    }, 300)
    // Clean up function to clear the timeout
    return () => {
      clearTimeout(debounceAndParseInput); 
    }
  })
</script>

<Input id={id} class={className} bind:value={searchValue} autocomplete={'off'} placeholder="Search" />

