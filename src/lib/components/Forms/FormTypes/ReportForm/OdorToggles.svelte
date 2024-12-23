<script>
  import Toggle from "$components/ui/toggle/toggle.svelte";
  let { selected, toggles } = $props();
</script>

<div class="flex flex-row justify-center xl:justify-evenly">
  {#each toggles as toggle}
    <div class="flex flex-col w-[100px] h-[100px] items-center">
      <Toggle
        variant="outline"
        pressed={selected === toggle.name.toLowerCase()}
        onPressedChange={() => {
          selected = toggle.name.toLowerCase();
        }}
        id={`${toggle.name.toLowerCase()}_type`}
        class="w-[75px] h-[75px]"
      >
        {#if typeof toggle.icon === 'string'}
          <span class="text-3xl">{toggle.icon}</span>
        {:else}
          <toggle.icon />
        {/if}

      </Toggle>
      <label for="${toggle.name.toLowerCase()}_type">{toggle.name}</label>
    </div>
  {/each}
</div>
