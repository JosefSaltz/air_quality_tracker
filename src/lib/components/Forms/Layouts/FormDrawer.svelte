<script lang="ts">
  import * as Drawer from "$components/ui/drawer";
  import { Button, buttonVariants, type ButtonVariant } from "$components/ui/button";
  import * as Alert from "../../ui/alert";
  Button;
  let { user, form, children } = $props();
  // Dumbest type appeasement I've ever done
  const buttonConfig = { size: "lg" as "lg", class: "bg-purple-800 hover:bg-purple-600" };
</script>

<Drawer.Root>
  <div class="relative w-full flex justify-center top-[60%]">
    <div class="flex flex-col justify-center">
      {#if user}
        <Drawer.Trigger
          class={`
            ${buttonVariants(buttonConfig)}
          `}
        >
          Report
        </Drawer.Trigger>
      {:else}
        <Button href="/auth/login" class={` ${buttonVariants(buttonConfig)}`}>Login</Button>
      {/if}
      {#if form?.success}<Alert.Root><Alert.Description class="success text-green-500">Report Successfully Submitted!</Alert.Description></Alert.Root>{/if}
    {#if form?.error}<Alert.Root><Alert.Description class="error text-red-500">form.error</Alert.Description></Alert.Root>{/if}
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
