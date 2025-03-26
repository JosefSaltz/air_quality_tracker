<script lang="ts">
  import { redirect } from "@sveltejs/kit";
  import { onMount } from "svelte";

  onMount(() => {
    // Redirection Timer
    setTimeout(() => {
      redirect(303, "/auth/login"); 
    }, 500)
  })
</script>

<div id="error-container" class="w-full h-full flex flex-col justify-center items-center">
  <p class="text-3xl">⚠️ Error During Auth Request</p>
  <p>Redirecting...</p>
</div>