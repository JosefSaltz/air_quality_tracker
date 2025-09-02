
<script lang="ts">
  import { dev } from '$app/environment';
  import ReportMap from '$components/ReportMap/ReportMap.svelte';
  import type { PageProps } from './$types';
  let { data, form }: PageProps = $props();
  if(dev) console.log(`🛠️ In Dev Mode`);
</script>

<ReportMap form={form} markers={data.markers} user={data.user} profile={data.profile} supabase={data.supabase} />