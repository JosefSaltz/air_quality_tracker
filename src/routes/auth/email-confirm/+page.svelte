<script lang="ts">
  import { goto } from "$app/navigation";

  let time = $state(10000); // Initial Starting Time of 5s
  
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
  }); // Counts down time and runs a redirect
</script>

<div id="email-confirm-container" class="w-full h-full flex flex-col justify-center items-center">
  <h1 class="text-3xl p-4">Your Account is Confirmed! ✅</h1>
  <p class="text-xl">You're account is validated and you are now logged in!</p>
  <p class="text-lg">Redirecting{ time ? ` in ${time / 1000}s` : ``}...</p>
  <p>Click <a href="/">here</a> to return to the front page or you automatic redirect.</p>
</div>
