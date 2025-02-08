<script lang="ts">
  import { PUBLIC_TURNSTILE_KEY } from "$env/static/public";
</script>

<svelte:head>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<div
  class="cf-turnstile"
  data-sitekey={PUBLIC_TURNSTILE_KEY}
  data-callback="javascriptCallback"
></div>