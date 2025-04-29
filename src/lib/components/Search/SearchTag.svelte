<script lang="ts">
  import { Temporal } from "@js-temporal/polyfill";
  type Props = { tagPrefix: string, date?: string, type?: string };
  let { tagPrefix, date, type }: Props = $props();
  const dateTime = new Date(date);

</script>

<div class="text-sm m-2 py-1 px-2 bg-fuchsia-200 rounded-sm ">
  {#if type === 'time'}
    <span>{ tagPrefix }: { date ? dateTime.toLocaleString("en-US", { "timeStyle": "short", "dateStyle": "medium" }) : null }</span>
  {/if}
  
</div>
