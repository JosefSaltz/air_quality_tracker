
<script lang="ts">
  import { dev } from '$app/environment';
  import Dashboard from "@/lib/components/Dashboard/Dashboard.svelte";
  import type { PageProps } from './$types';
  let { data, form }: PageProps = $props();
  dev && console.log(`🛠️ In Dev Mode`);
</script>

<Dashboard form={form} user={data.user} markers={data.markers} />