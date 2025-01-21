<script lang="ts">
  import { Button } from "$components/ui/button/index";
  import Card from "$components/ui/card/card.svelte";
  import { readGeoPermission } from "@/lib/utils/readGeoPermission";
  import { onMount } from "svelte";

  type Props = {
    onClickHandler: () => any,
    permissionState: PermissionState
  }

  let { onClickHandler, permissionState }: Props = $props();
</script>

<Card class="flex flex-col w-[100%] h-[100%] justify-center items-center gap-2">
  {#if permissionState === "denied"}
    <h1>Please unblock geolocation permissions to use</h1>
  {:else if permissionState === "prompt"}
    <h1>Need Location Permissons</h1>
    <Button onclick={onClickHandler}>Request Permissions</Button>
  {/if}
</Card>