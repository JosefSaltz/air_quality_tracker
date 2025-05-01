<script lang="ts">
	import { ToggleGroup as ToggleGroupPrimitive } from "bits-ui";
	import { type ToggleVariants, getToggleGroupCtx } from "./index.js";
	import { cn } from "$lib/utils.js";
	import { toggleVariants } from "$lib/components/ui/toggle/index.js";

	type Props = ToggleGroupPrimitive.ItemProps & ToggleVariants & { children: any};
	let { children, size = "default", variant = "default", value, ...otherProps }: Props = $props();
	let className: string | undefined | null = $state(undefined);
	export { className as class };

	const ctx = getToggleGroupCtx();
</script>

<ToggleGroupPrimitive.Item
	class={cn(
		toggleVariants({
			variant: ctx.variant || variant,
			size: ctx.size || size,
		}),
		className
	)}
	{value}
	{...otherProps}
>
	{@render children()}
</ToggleGroupPrimitive.Item>
