<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import Button from "$components/ui/button/button.svelte";
  import * as DropdownMenu from "$components/ui/dropdown-menu";
  import DateRangePicker from '../DateRangePicker/DateRangePicker.svelte';
  import type { DateRange } from '@internationalized/date';
  
  
  let dateRange = $state<DateRange | null>(null)
  let selection = $state(page.url.searchParams.get('time') || 'month');

  const timeOptions = new Map([
    ["today", { name: "Today", value: 1 }],
    ['week', { name: "Week", value: 7 }],
    ['month', { name: "Month", value: 30 }],
    ['custom', { name: "Custom", value: false }]
  ]);

  $effect(() => {
    // Create a search params interface from the current page url
    let params = new URLSearchParams(page.url.searchParams.toString());
    // If state hasn't changed from URL don't run
    if(selection === params.get('time')) return;
    // Update the time param with the current selection
    params.set('time', selection)
    // Navigate browser to the new url
    goto(`/?` + params);
  }) 
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <Button class="w-16 bg-purple-700 rounded-l-md">{ timeOptions.get(selection)?.name }</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.RadioGroup bind:value={selection}>
      {#each timeOptions as option}
        <DropdownMenu.RadioItem value={option[0]}>
          {option[1].name}
        </DropdownMenu.RadioItem>
      {/each}
    </DropdownMenu.RadioGroup>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<DateRangePicker presetTime={Number(timeOptions.get(selection)?.value)} />