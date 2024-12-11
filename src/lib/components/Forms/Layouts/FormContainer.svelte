<script lang="ts">
  let props = $props();
  let { children, style } = props; 
</script>

<div id="form-layout" class="flex flex-col w-full justify-center">
  {@render children()}
</div>