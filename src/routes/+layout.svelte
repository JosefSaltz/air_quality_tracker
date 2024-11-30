<script lang="ts">
  import "@/app.css";
  let { children } = $props();
</script>

<div class="flex align-center">

  {@render children()}
</div>

