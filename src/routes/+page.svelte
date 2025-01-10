<script lang="ts">
  import { dev } from '$app/environment';
  import Dashboard from "@/lib/components/Dashboard/Dashboard.svelte";
  import type { PageData } from './$types';
  
  let { data }: { data: PageData } = $props();
  dev && console.log(`🛠️ In Dev Mode`);	
</script>

<Dashboard markers={data.markers} />