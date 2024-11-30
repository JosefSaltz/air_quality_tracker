<script lang="ts">
  import "../app.css";
  import "@/app.css";
  let { children } = $props();
</script>

<div class="flex justify-center h-full">
  <div class="flex flex-col justify-center content-center">
    {@render children()}
  </div>
  
</div>

