<script lang="ts">
  import * as Drawer from "$components/ui/drawer";
  import { Button, buttonVariants, type ButtonVariant } from "$components/ui/button";
  import * as Alert from "../../ui/alert";
  Button;
  let { user, form, children, open = $bindable() } = $props();
  let showAlert = $state(false);
  // Dumbest type appeasement I've ever done
  const buttonConfig = { size: "lg" as "lg", class: "bg-purple-800 hover:bg-purple-600" };
  
  $effect(() => {
    if(form?.success || form?.error) {
      showAlert = true;
      const dismissTimer = setTimeout(() => {
        showAlert = false
      } , 5000);
      // Clean up function
      return () => { clearTimeout(dismissTimer) }
    }
  })

</script>
<div class="">
  <Drawer.Root bind:open repositionInputs={false} >
    <div id="report-placement-container" class="flex justify-center absolute left-1/2 transform -translate-x-1/2 z-[500] top-[60%]">
      <div class="flex flex-col justify-center">
        {#if user}
          <Drawer.Trigger class={`${buttonVariants(buttonConfig)}`}>
            Report
          </Drawer.Trigger>
        {:else} <!-- Show Login Button-->
          <Button href="/auth/login" class={`${buttonVariants(buttonConfig)} z-[10]`}>Login</Button>
        {/if}

        {#if form?.success && showAlert}<Alert.Root><Alert.Description class="success text-green-500 ">Report Successfully Submitted!</Alert.Description></Alert.Root>{/if}
        {#if form?.error && showAlert}<Alert.Root><Alert.Description class="error text-red-500 transition-all ease-in-out">form.error</Alert.Description></Alert.Root>{/if}
      </div>
    </div>
      <Drawer.Content>
        {@render children()}
        <div id="drawer-footer" class="flex justify-center flex-grow-1">
          <Drawer.Footer class="w-full xl:w-auto">
            <Drawer.Close class={`bg-stone-300 ${buttonVariants(buttonConfig)}`}>Close</Drawer.Close>
          </Drawer.Footer>
        </div>
      </Drawer.Content>
  </Drawer.Root>
</div>