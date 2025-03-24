<script lang="ts">
  import { turnstile } from '@svelte-put/cloudflare-turnstile';
  import { PUBLIC_TURNSTILE_KEY } from "$env/static/public";
  type Props = { 
    callback: (response: Response) => void, 
    className?: string, 
    wasChecked: boolean 
  };
  let { callback, className, wasChecked = $bindable() }: Props = $props();
</script>

<div
  use:turnstile
  id="turnstile-widget"
  class={`cf-turnstile ${className}`}
  turnstile-sitekey={PUBLIC_TURNSTILE_KEY}
  turnstile-theme="light"
  onturnstile={(e) => { wasChecked = true } }
></div>