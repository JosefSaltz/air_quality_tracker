<script lang="ts">
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import type { DateRange } from "bits-ui";
  import {
   CalendarDate,
   DateFormatter,
   type DateValue,
   getLocalTimeZone
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  
  type Props = {
    dateRange: DateRange | null,
    presetTime?: number
  }

  let { dateRange = $bindable(), presetTime }: Props = $props();

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const currentCalendarDate = new CalendarDate(currentYear, currentMonth, currentDay);

  const df = new DateFormatter("en-US", {
   dateStyle: "medium"
  });
  const stateInvalidated = () => {
    const startMatch = value.start?.toString() === page.url.searchParams.get('after');
    const endMatch = value.end?.toString() === page.url.searchParams.get('before');
    // If the state start and end dates match return false
    return !(startMatch && endMatch);
  }
  let value: DateRange = $state({
   start: presetTime ? currentCalendarDate.subtract({ days: presetTime}) : currentCalendarDate,
   end: currentCalendarDate
  });
  $inspect(value)
  let startValue: DateValue | undefined = $state(undefined);

  $effect(() => {
    // Get URL Params Interface from current page state
    const params = new URLSearchParams(page.url.searchParams.toString())
    // Don't manipulate state when custom search isn't selected and state hasn't changed
    if(params.get('time') !== 'custom' || !stateInvalidated()) return;
    // Add necessary operators to current params
    value.start && params.set('after', value.start.toString())
    value.end && params.set('before', value.end.toString())
    // Renavigate and don't lose focus
    goto('/?' + params.toString(), { keepFocus: true })
  })
 </script>
  
 <div class="grid gap-2">
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