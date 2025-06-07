<script lang="ts">
  let { class: className = "" } = $props();
</script>

<div class={className}>
  <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
  <div class="mt-2">
    <input type="password" name="password" id="password" autocomplete="current-password" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
  </div>
</div>