<script lang="ts">
	import './layout.css';
	let { children } = $props();
</script>

<div
	class="overflow-x-hidden bg-background-dark font-mono text-gray-300 selection:bg-primary/30 selection:text-white"
>
	<div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
		<div
			class="absolute top-0 left-0 h-full w-full bg-grid-pattern bg-size-[4rem_4rem] opacity-[0.03]"
		></div>
		<div
			class="absolute -top-[20%] -left-[10%] h-125 w-125 rounded-full bg-primary/10 blur-[120px]"
		></div>
		<div
			class="absolute top-[40%] -right-[10%] h-100 w-100 rounded-full bg-code-keyword/5 blur-[100px]"
		></div>
	</div>

	{@render children()}
</div>
