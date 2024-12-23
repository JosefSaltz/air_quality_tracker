<script lang="ts">
  import Drawer from "../../ui/drawer/drawer.svelte";

  let props = $props();
  let { children, style } = props; 
  let open = $state(false);
  const toggleDrawer = () => { open = !open }
</script>

<div id="form-layout" class="flex flex-col w-full xl:max-w-xl min-h-[33%] justify-center">
  <Drawer open={open}>
    {@render children()}
  </Drawer>
</div>