<script lang="ts" module>
  const timeOptions = {
    'Today': { name: "Today", days: 1 },
    'Week': { name: "Week", days: 7 },
    'Month': { name: "Month", days: 30 },
    'Custom': { name: "Custom", days: false }
  } as const;

  type TimeOptionKey = keyof typeof timeOptions;

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
  import { today, getLocalTimeZone, type DateValue, parseDate  } from '@internationalized/date';
  import { daysBetween } from '$lib/utils/getTimeSpan';
  import { onMount } from 'svelte';
  
  let selection = $state<TimeOptionKey>(page.url.searchParams.get('time') as TimeOptionKey || 'Month');
  let timeRange = $state<DateRange | undefined>(getCurrentRange() || selectedTimeRange(selection));

  function getCurrentRange() {
    const params = new URLSearchParams(page.url.searchParams.toString());
    const [after, before] = [params.get('after') ?? undefined, params.get('before') ?? undefined];
    if(!after || !before) return;
    const start = parseDate(after);
    const end = parseDate(before);
    return { start, end } satisfies DateRange;
  }

  function selectedTimeRange(selectedTime: TimeOptionKey) {
    // Simplest return first
    if(selectedTime === 'Custom') return;
    const todayCalDate = today(getLocalTimeZone());
    if(selectedTime === 'Today') return { end: todayCalDate, start: todayCalDate };
    if(selectedTime === 'Week') return { end: todayCalDate, start: todayCalDate.subtract({ days: 7 }) };
    if(selectedTime === 'Month') return { end: todayCalDate, start: todayCalDate.subtract({ days: 30 }) };
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
    const presetTime = selectedTimeRange(selection);
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