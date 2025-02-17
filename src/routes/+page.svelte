
<script lang="ts">
  import { dev } from '$app/environment';
  import ReportMap from '@/lib/components/ReportMap/ReportMap.svelte';
  import type { PageProps } from './$types';
  let { data, form }: PageProps = $props();
  dev && console.log(`🛠️ In Dev Mode`);
</script>

<ReportMap markers={data.markers} form={form}  user={data.user} />