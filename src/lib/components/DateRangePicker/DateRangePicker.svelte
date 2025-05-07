<script lang="ts">
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import type { DateRange } from "bits-ui";
  import {
   CalendarDate,
   DateFormatter,
   type DateValue,
   getLocalTimeZone,
   parseDate
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  
  type Props = {
    presetTime?: number
  }

  let { presetTime }: Props = $props();

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const currentCalendarDate = new CalendarDate(currentYear, currentMonth, currentDay);

  const df = new DateFormatter("en-US", {
   dateStyle: "medium"
  });

  let value: DateRange = $state({
   start: presetTime ? currentCalendarDate.subtract({ days: presetTime}) : currentCalendarDate,
   end: currentCalendarDate
  });

  let startValue: DateValue | undefined = $state(undefined);
  onMount(() => {
    // Get URL Params Interface from current page state
    const params = new URLSearchParams(page.url.searchParams.toString());
    // Get before and after params if they exist
    const beforeParam = params.get('before');
    const afterParam = params.get('after');
    // Assign params to value state if they're preset
    if(afterParam) value.start = parseDate(afterParam);
    if(beforeParam) value.end = parseDate(beforeParam);
  })

  $effect(() => {
    // Get URL Params Interface from current page state
    const params = new URLSearchParams(page.url.searchParams.toString())
    // Add necessary operators to current params
    value.start && params.set('after', value.start.toString())
    value.end && params.set('before', value.end.toString())
    // QOL Assign Old Params from page state
    const oldParams = new URLSearchParams(page.url.searchParams.toString());
    // Renavigate and don't lose focus
    if(oldParams.toString() !== params.toString()) goto('/?' + params.toString(), { keepFocus: true })
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

