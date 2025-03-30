<script lang="ts">
  import { PUBLIC_CITY_NAME } from "$env/static/public"
  type Props = {
    name?: string
  }
  let { name }: Props = $props();
</script>

<div class="sm:mx-auto w-full xl:w-auto sm:max-w-md flex flex-col items-center">
  <enhanced:img src="../assets/logo.png" class="h-28 md:h-36 xl:h-64 w-auto rounded-xl" alt="PIITA Logo" />
  <h2 class="mt-3 md:mt-6 text-center text-lg md:text-2xl font-bold tracking-tight text-gray-900">
    PIITA { name }
  </h2>
  {#if PUBLIC_CITY_NAME}
    <h4>{PUBLIC_CITY_NAME} Edition</h4>
  {/if}
</div>