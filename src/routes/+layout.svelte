<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';

	let { children } = $props();

	// Cursor spotlight
	let mx = $state(0);
	let my = $state(0);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		const move = (e: MouseEvent) => {
			mx = e.clientX;
			my = e.clientY;
		};
		window.addEventListener('mousemove', move, { passive: true });
		return () => window.removeEventListener('mousemove', move);
	});
</script>

<div class="overflow-x-hidden bg-[#0a0a0f] font-sans text-gray-300 selection:bg-blue-500/30 selection:text-white">
	<!-- Fixed background layers -->
	<div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
		<!-- Grid -->
		<div class="absolute inset-0 bg-grid-pattern bg-size-[3rem_3rem] opacity-100"></div>

		<!-- Ambient light sources -->
		<div class="absolute -top-[30%] -left-[15%] h-[600px] w-[600px] rounded-full bg-blue-500/8 blur-[160px] animate-glow-pulse"></div>
		<div class="absolute top-[45%] -right-[10%] h-[400px] w-[400px] rounded-full bg-violet-500/6 blur-[130px] animate-glow-pulse delay-3"></div>
		<div class="absolute bottom-[10%] left-[20%] h-[300px] w-[300px] rounded-full bg-teal-500/5 blur-[110px] animate-glow-pulse delay-5"></div>
	</div>

	<!-- Cursor spotlight (desktop only) -->
	{#if mounted}
		<div
			class="pointer-events-none fixed z-0 hidden md:block transition-all duration-300 ease-out"
			style="
				left: {mx}px;
				top: {my}px;
				width: 600px;
				height: 600px;
				transform: translate(-50%, -50%);
				background: radial-gradient(circle at center, rgba(59,130,246,0.06) 0%, transparent 70%);
				border-radius: 50%;
			"
		></div>
	{/if}

	<!-- Content -->
	<div class="relative z-10">
		{@render children()}
	</div>
</div>
