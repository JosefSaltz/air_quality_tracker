<script lang="ts">
  import { dev } from '$app/environment';
  import Dashboard from "@/lib/components/Dashboard.svelte";
  import UpdateProfile from '$lib/components/UpdateProfile.svelte';
  
  let data = $props();
  dev && console.log(`🛠️ In Dev Mode`);
	// Reactive statement to update avatar when data changes
	let userProfile = $state(data?.userProfile || '');
</script>

<Dashboard />