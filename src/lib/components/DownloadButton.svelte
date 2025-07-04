<script lang="ts">
  import Button from "$components/ui/button/button.svelte";
  import { Loader2Icon } from "@lucide/svelte";
  
  let { downloading = $bindable(), ...rest } = $props();
</script>

<Button class="max-w-32" variant="secondary" {...rest}>
  {#if downloading}<Loader2Icon class="animate-spin" />{/if}
  {downloading ? 'Downloading...' : 'Download'}
</Button>