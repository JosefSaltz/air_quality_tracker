<script>
  let { class: className = ""} = $props()
</script>

<div class={className}>
  <label for="email" class="block text-sm/6 font-medium text-gray-900">
    Email address
  </label>
  <div>
    <input type="email" name="email" id="email" autocomplete="email" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-solid outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline--600 sm:text-sm/6">
  </div>
</div>
