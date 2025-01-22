<script lang="ts">
  import { dev } from "$app/environment";
  import { PUBLIC_DOMAIN } from "$env/static/public";
  //let { } = $props();
  const getLoginURI = () => dev ? 'http://localhost:54321' : PUBLIC_DOMAIN;
</script>
