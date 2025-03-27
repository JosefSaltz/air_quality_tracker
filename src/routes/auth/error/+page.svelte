<script lang="ts">
  import { goto } from "$app/navigation";
  // Set initial state of 5 seconds
  let time = $state(5000);

  $effect(() => {
    let timer: NodeJS.Timeout;
    // Set a one second timer to update state 
    if(time > 0) {
      timer = setTimeout(() => {
        time = time - 1000;
      }, 1000)
    }
    // When out of time redirect to the login page
    else {
      goto("/auth/login")
    }
    // Clean up function
    return () => clearTimeout(timer);
  })
</script>

<div id="error-container" class="w-full h-full flex flex-col justify-center items-center">
  <p class="text-3xl">⚠️ Error During Authentication Request</p>
  <p>Redirecting{ time ? ` in ${time / 1000}s` : ``}...</p>
</div>