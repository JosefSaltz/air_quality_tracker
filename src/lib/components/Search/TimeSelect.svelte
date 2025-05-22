<script lang="ts" module>
    import { timeOptions, type TimeOptionKey } from '@/lib/constants';
    export function matchTimeOption(days: number) {
    return Object.values(timeOptions)
      .find(option => option.days === days) || { name: 'Custom'};
  }
</script>

<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import Button from "$components/ui/button/button.svelte";
  import * as DropdownMenu from "$components/ui/dropdown-menu";
  import DateRangePicker from '$components/DateRangePicker/DateRangePicker.svelte';
  import type { DateRange } from "bits-ui";
  import {  parseDate  } from '@internationalized/date';
  import { onMount } from 'svelte';
  import { generateTimeRange } from '@/lib/utils/generateTimeRange';
  
  let { class: className = '' } = $props()

  let selection = $state<TimeOptionKey>(page.url.searchParams.get('time') as TimeOptionKey || 'Month');
  let timeRange = $state<DateRange | undefined>(getCurrentRange() || generateTimeRange(selection));

  function getCurrentRange() {
    const params = new URLSearchParams(page.url.searchParams.toString());
    const [after, before] = [params.get('after') ?? undefined, params.get('before') ?? undefined];
    if(!after || !before) return;
    const start = parseDate(after);
    const end = parseDate(before);
    return { start, end } satisfies DateRange;
  }

  onMount(() => {
    // Create a Search Params interface from current page state
    const params = new URLSearchParams(page.url.searchParams.toString());
    // Overload the searchValue if there's already a search param present
    selection = params.get('time') as TimeOptionKey || 'Month';
  })

  $effect(() => {
    const { pathname } = page.url;
    // Get a preset timerange if it matches the current selection
    const presetTime = generateTimeRange(selection);
    if(presetTime) timeRange = presetTime;
    // Otherwise try getting directly from the URL
    if(!presetTime) timeRange = getCurrentRange();
    // Create a search params interface from the current page url
    const params = new URLSearchParams(page.url.searchParams.toString());
    const oldParams = page.url.searchParams.toString()
    // If state is the same from URL don't run
    if(selection === params.get('time')) return;
    // Update the time param with the current selection
    params.set('time', selection)
    // Navigate browser to the new url if params are different and path is root
    if(params.toString() !== oldParams && pathname === "/") goto(`/?` + params);
  })

</script>

<div class={`flex ${className} pt-2 md:pt-0`}>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <Button class="w-16 bg-purple-700 rounded-l-md">{ selection }</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.RadioGroup bind:value={selection}>
        {#each Object.values(timeOptions) as option}
          <DropdownMenu.RadioItem value={option.name}>
            {option.name}
          </DropdownMenu.RadioItem>
        {/each}
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
  </DropdownMenu.Root>

  <DateRangePicker bind:timeRange={timeRange} bind:selection={selection} />
</div>