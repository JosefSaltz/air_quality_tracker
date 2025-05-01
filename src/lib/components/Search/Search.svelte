<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Input from "$components/ui/input/input.svelte";
  import TimeSelect from "./TimeSelect.svelte";

  
  // Define state to using existing params if they exist or default to undefined
  let searchValue = $state<string | undefined>(page.url.searchParams.get('search') || '');
  
  // Extracts the date from searched before: and after: operators in YYYY-MM-DD format
  const parseOperators = (searchInput?: string | null) => {
    // Invalid input returns the standard output with null values
    if(!searchInput) return { afterDate: null, beforeDate: null };
    // Pattern matches for determining if operators in input
    const beforeMatch = searchInput.match(/before:(\d{4}-\d{2}-\d{2})/);
    const afterMatch = searchInput.match(/after:(\d{4}-\d{2}-\d{2})/);
    // Assign matches
    const beforeDate = beforeMatch ? beforeMatch[1] : null;
    const afterDate = afterMatch ? afterMatch[1] : null;
    // Return object matched pattern or null
    return { afterDate, beforeDate };
  }

  $effect(() => {
    // Create a Search Params interface from existing page params
    const params = new URLSearchParams(page.url.searchParams.toString());
    // Check if the user wrote before and after search operators
    const { beforeDate, afterDate } = parseOperators(searchValue);
    // If we have a before or after operator set the time to custom
    if(beforeDate || afterDate) params.set('time', 'custom');
    // Add a concatenable before or after param to the string
    if(beforeDate) params.set('before', beforeDate);
    if(afterDate) params.set('after', afterDate);
    // Update Search if there's a value in state and it doesn't match the current search Param
    if(searchValue) params.set('search', searchValue);
    else params.delete('search');
    // Debounce Search Input and parse relevant parameters
    const debounceAndParseInput = setTimeout(() => {
      goto('/?' + params, { keepFocus: true });
    }, 300)
    // Clean up function to clear the timeout
    return () => {
      clearTimeout(debounceAndParseInput) 
    }
  })
</script>

<div 
  id="search-container" 
  class="w-full flex justify-center items-center "
>
  <TimeSelect />
  <Input bind:value={searchValue} class="w-full max-w-96 md:max-w-full ring-0" autocomplete={'off'} />
</div>
