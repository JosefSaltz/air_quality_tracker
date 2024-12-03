<script lang="ts">
  let props = $props();
  let { children, style } = props; 
</script>

<div id="form-layout" class="flex flex-col flex-grow-1 w-full justify-center p-10">
  {@render children()}
</div>