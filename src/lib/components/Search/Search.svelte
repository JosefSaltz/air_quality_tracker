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
    const newParams = new URLSearchParams(page.url.searchParams.toString());
    const searchParam = newParams.get('search');
    // If params and searchValue desynced and searchValue isn't just undefined
    if (searchValue !== searchParam && searchValue !== undefined) {
      // Set the new search value
      newParams.set('search', searchValue);
      // If it was an empty string, delete the param entirely
      if(searchValue === '') newParams.delete('search');
    }
    // Debounce Search Input and parse relevant parameters
    const debounceAndParseInput = setTimeout(() => {
      const oldParams = page.url.searchParams.toString();
      // If the current params object doesn't match the current page state update it
      if(oldParams !== newParams.toString()) goto('/?' + newParams, { keepFocus: true });
    }, 300)
    // Clean up function to clear the timeout
    return () => {
      clearTimeout(debounceAndParseInput); 
    }
  })
</script>

<Input id={id} class={className} bind:value={searchValue}  autocomplete={'off'} />

