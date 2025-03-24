<script lang="ts">
  import { PUBLIC_TURNSTILE_KEY } from "$env/static/public";

  let { callback, className }: { callback: (response: Response) => void, className?: string } = $props()
</script>

<svelte:head>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<div
  class={`cf-turnstile ${className}`}
  data-sitekey={PUBLIC_TURNSTILE_KEY}
  data-callback={callback}
  data-theme="light"
></div>