<script lang="ts">
  import { PUBLIC_CITY_NAME } from "$env/static/public";
  
  let { name = "", class: className ="" } = $props();
</script>

<div class={ className }>
  <enhanced:img src="../assets/logo.png" class="h-[64px] sm:h-[72px] md:h-[144px] w-auto rounded-xl" alt="PIITA Logo" />
  <h2 class="mt-3 md:mt-6 text-center text-lg md:text-2xl font-bold tracking-tight text-gray-900">
    PIITA { name }
  </h2>
  {#if PUBLIC_CITY_NAME}
    <h4 class="hidden md:inline">{PUBLIC_CITY_NAME} Edition</h4>
  {/if}
</div>