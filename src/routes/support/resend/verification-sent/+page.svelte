<script lang="ts">
  import { goto } from "$app/navigation";

  let time = $state(5000); // Set initial state of 5s

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
      goto("/")
    }
    // Clean up function
    return () => clearTimeout(timer)
  }); // Counts down time and runs a redirect // Subtracts time until 0
</script>

<div id="reset-password-container" class="w-full h-full flex flex-col justify-center items-center">
  <h1 class="text-3xl">Resent Account Verification! ✅</h1>
  <p class="text-xl">Your account verification has been resent to the entered email if it exists.</p>
  <p class="text-lg">Redirecting{ time ? ` in ${time / 1000}s` : ``}...</p>
</div>