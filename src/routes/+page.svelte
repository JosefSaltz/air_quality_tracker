<script lang="ts">
  import { dev } from '$app/environment';
  import Dashboard from "@/lib/components/Dashboard.svelte";
  dev && console.log(`🛠️ In Dev Mode`);
</script>

<Dashboard />