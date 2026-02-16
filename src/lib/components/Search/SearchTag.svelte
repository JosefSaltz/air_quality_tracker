<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  type Props = { tagPrefix: string, date?: string, type?: string };
  let { tagPrefix, date, type }: Props = $props();
  let nodeRef: Node;
  const dateTime = new Date(date);
  const selfRemove = () => {
    // Create a new SearcParams interface
    const params = new URLSearchParams(page.url.searchParams.toString())
    const searchParam = page.url.searchParams.get('search');
    // Remove Params as needed and update the search URL param
    if(tagPrefix === 'Before') {
      params.delete("before");
      searchParam && params.set('search', searchParam.replace(`before=${date}`, ''))
    };
    if(tagPrefix === 'After') { 
      params.delete("after");
      searchParam && params.set('search', searchParam.replace(`after=${date}`, ''))
    }
    // Navigate to new URL
    goto(params ? '/?' + params : '/');
  }
</script>

<div class="text-sm m-2 py-1 px-2 bg-fuchsia-200 rounded-sm" bind:this={nodeRef}>
  {#if type === 'time'}
    <span>{ tagPrefix }: { date ? dateTime.toLocaleString("en-US", { "timeStyle": "short", "dateStyle": "medium" }) : null }</span>
    <button onclick={selfRemove} class="hover:bg-fuchisa-400 rounded-full px-2">x</button>
  {/if}
</div>
