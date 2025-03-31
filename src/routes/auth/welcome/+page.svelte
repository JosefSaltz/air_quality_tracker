<script lang="ts">
  import { goto } from "$app/navigation";

  let time = $state(5000); // Initial Starting Time of 5s
  
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
    return () => clearTimeout(timer)
  }); // Counts down time and runs a redirect
</script>

<div id="welcome-container" class="w-full h-full flex flex-col justify-center items-center">
  <h1 class="text-3xl p-4">Thanks for Signing Up! 😊</h1>
  <p class="text-xl">An email has been sent to your address. Please click the link to verify before logging in.</p>
  <p class="text-lg">Redirecting{ time ? ` in ${time / 1000}s` : ``}...</p>
</div>
