<script lang="ts">
  import ReportForm from "$lib/components/ReportForm.svelte"
  import { dev } from '$app/environment';
  import Card from "@/lib/components/ui/card/card.svelte";
  dev && console.log(`🛠️ In Dev Mode`);
</script>

<Card class="report_card ">
<ReportForm />
</Card>

<style lang="postcss">

</style>