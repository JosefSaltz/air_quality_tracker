<script lang="ts">
  let props = $props();
  let { children, style } = props; 
</script>

<div id="form-layout" class="flex flex-col min-w-fit justify-center">
  {@render children()}
</div>