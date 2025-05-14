<script lang="ts">
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import {
   CalendarDate,
   DateFormatter,
   type DateValue,
   getLocalTimeZone,

  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";

  
  let { timeRange: value = $bindable(), selection = $bindable() }: Props = $props();

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const currentCalendarDate = new CalendarDate(currentYear, currentMonth, currentDay);
  const isCustomTime = () => {
    return page.url.searchParams.get('time') === 'Custom';
  }
  const df = new DateFormatter("en-US", {
   dateStyle: "medium"
  });

  let startValue: DateValue | undefined = $state(undefined);

  $effect(() => {
    // Get URL Params Interface from current page state
    const params = new URLSearchParams(page.url.searchParams.toString());
    const { pathname } = page.url;
    // Destructure value
    const { start, end } = value;
    // Add necessary operators to current params
    start && params.set('after', start.toString())
    end && params.set('before', end.toString())
    // QOL Assign Old Params from page state
    const oldParams = new URLSearchParams(page.url.searchParams.toString());
    // Renavigate if params changed and don't lose focus
    if(oldParams.toString() !== params.toString() && pathname === "/") goto('/?' + params.toString(), { keepFocus: true })
  })
 </script>
  
 <div class={`grid gap-2 ${isCustomTime() ? '': 'hidden'}`}>
  <Popover.Root>
   <Popover.Trigger
    class={cn(
     buttonVariants({ variant: "outline" }),
     !value && "text-muted-foreground"
    )}
   >
    <CalendarIcon class="mr-2 size-4" />
    {#if value && value.start}
      {#if value.end}
        {df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
        value.end.toDate(getLocalTimeZone())
        )}
      {:else}
        {df.format(value.start.toDate(getLocalTimeZone()))}
      {/if}
    {:else if startValue}
      {df.format(startValue.toDate(getLocalTimeZone()))}
    {:else}
      Pick a date
    {/if}
   </Popover.Trigger>
   <Popover.Content class="w-auto p-0" align="start">
    <RangeCalendar
     bind:value
     onStartValueChange={(v) => {
      startValue = v;
     }}
     numberOfMonths={2}
    />
   </Popover.Content>
  </Popover.Root>
 </div>

