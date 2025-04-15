<script lang="ts">
  import { setContext } from "svelte";
  import Input from "$components/ui/input/input.svelte";
  import TimeSelect from "./TimeSelect.svelte";
  let searchValue = $state<string | null>(null);
  let timeSelect = $state('month')
</script>

<div 
  id="search-container" 
  class="w-full flex justify-center items-center "
>
  <TimeSelect />
  <Input bind:value={searchValue} class="w-full max-w-96 md:max-w-full" />
</div>
