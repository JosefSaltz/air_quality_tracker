<script lang="ts">
  import { turnstile, type TurnstileEventDetail } from '@svelte-put/cloudflare-turnstile';
  import { PUBLIC_TURNSTILE_KEY } from "$env/static/public";
  type Props = { 
    class: string, 
    cfResponse: null | string 
  };
  let { class: className = "", cfResponse = $bindable() }: Props = $props();
  const handleSuccess = (e: CustomEvent<TurnstileEventDetail<{ token: string }>>) => {
    let response = e.detail.turnstile.getResponse('#turnstile-widget'); 
    if(response) cfResponse = response;
  }
</script>

<div
  use:turnstile
  id="turnstile-widget"
  class={`cf-turnstile ${className}`}
  turnstile-sitekey={PUBLIC_TURNSTILE_KEY}
  turnstile-theme="light"
  onturnstile={(e) => { handleSuccess(e) } }
></div>