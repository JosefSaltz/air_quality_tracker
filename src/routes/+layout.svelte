<script lang="ts">
  import "../app.css";
  import "@/app.css";
  let { children } = $props();
</script>

<div class="flex justify-center h-full">
  <div class="flex flex-col justify-center w-2/3">
      {@render children()}
  </div>
</div>