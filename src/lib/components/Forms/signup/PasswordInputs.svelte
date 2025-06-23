<script lang="ts">
  let { password = $bindable(), confirm_pw = $bindable()} = $props();
</script>

<div id="password-container">
  <!-- Password Input -->
  <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
  <div class="mt-2">
    <input type="password" name="password" bind:value={password} id="password" autocomplete="current-password" minlength=6 required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
  </div>
  <!-- Password Confirm -->
  <label for="confirm" class="block text-sm/6 font-medium text-gray-900">Verify Password</label>
  <div class="mt-2">
    <input type="password" name="confirm" bind:value={confirm_pw} id="confirm" autocomplete="current-password" minlength=6 required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
  </div>
</div>