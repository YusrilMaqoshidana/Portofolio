<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	interface Props {
		brandName?: string;
		brandLink?: string;
		resumeLink?: string;
	}

	let {
		brandName = 'Yusril',
		brandLink = '#home',
		resumeLink = '/cv'
	}: Props = $props();

	let mobileMenuOpen = $state(false);
	let activeSection = $state('home');
	let scrolled = $state(false);
	let loadingCv = $state(false);

	function openCvWithLoading() {
		if (loadingCv) return;
		loadingCv = true;
		setTimeout(() => {
			window.location.href = '/cv?view=pdf';
		}, 350);
	}

	const navItems = [
		{ id: 'home',         number: '01.', label: '_home',         activeColor: 'text-blue-400',   hoverColor: 'hover:text-blue-400',   activeBg: 'bg-blue-500/10 border-blue-500/25' },
		{ id: 'education',    number: '02.', label: '_education',    activeColor: 'text-emerald-400', hoverColor: 'hover:text-emerald-400', activeBg: 'bg-emerald-500/10 border-emerald-500/25' },
		{ id: 'experience',   number: '03.', label: '_experience',   activeColor: 'text-red-400',    hoverColor: 'hover:text-red-400',    activeBg: 'bg-red-500/10 border-red-500/25' },
		{ id: 'projects',     number: '04.', label: '_projects',     activeColor: 'text-amber-400',  hoverColor: 'hover:text-amber-400',  activeBg: 'bg-amber-500/10 border-amber-500/25' },
		{ id: 'skills',       number: '05.', label: '_skills',       activeColor: 'text-teal-400',   hoverColor: 'hover:text-teal-400',   activeBg: 'bg-teal-500/10 border-teal-500/25' },
		{ id: 'achievements', number: '06.', label: '_honors',       activeColor: 'text-yellow-400', hoverColor: 'hover:text-yellow-400', activeBg: 'bg-yellow-500/10 border-yellow-500/25' }
	];

	function toggleMobileMenu() { mobileMenuOpen = !mobileMenuOpen; }
	function closeMobileMenu() { mobileMenuOpen = false; }
	function handleNavClick(id: string) { closeMobileMenu(); activeSection = id; }

	onMount(() => {
		// Hash tracking
		if (window.location.hash) {
			const hashId = window.location.hash.replace('#', '');
			if (navItems.some((item) => item.id === hashId)) activeSection = hashId;
		}

		// Scroll depth for nav intensification
		const onScroll = () => { scrolled = window.scrollY > 20; };
		window.addEventListener('scroll', onScroll, { passive: true });

		// Section tracking
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) activeSection = entry.target.id;
				});
			},
			{ root: null, rootMargin: '-20% 0px -50% 0px', threshold: 0 }
		);
		navItems.forEach((item) => {
			const el = document.getElementById(item.id);
			if (el) observer.observe(el);
		});

		return () => {
			window.removeEventListener('scroll', onScroll);
			observer.disconnect();
		};
	});
</script>

<nav class="fixed top-0 right-0 left-0 z-50">
	<div class="mx-auto mt-3 max-w-7xl px-3 md:mt-4 md:px-6">
		<div
			class="flex items-center justify-between rounded-2xl md:rounded-full px-4 md:px-5 py-2.5 transition-all duration-500 glass-gradient-border noise relative
				{scrolled
					? 'bg-[rgba(10,10,15,0.85)] backdrop-blur-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.05)_inset]'
					: 'bg-[rgba(10,10,15,0.5)] backdrop-blur-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.3)]'}"
		>
			<!-- Brand -->
			<a
				class="group flex items-center gap-0.5 font-mono text-base md:text-lg font-bold tracking-tight"
				href="/"
			>
				<span class="text-blue-400 transition-colors group-hover:text-white">&lt;</span>
				<span class="text-white">{brandName}</span>
				<span class="text-blue-400 transition-colors group-hover:text-white"> /&gt;</span>
			</a>

			<!-- Desktop nav -->
			<div class="hidden items-center gap-1 text-[11px] lg:text-xs font-medium md:flex font-mono">
				{#each navItems as item (item.id)}
					{@const isActive = activeSection === item.id}
					<a
						class="flex items-center gap-1 px-2.5 py-1.5 rounded-full border transition-all duration-200
							{isActive
								? `${item.activeColor} ${item.activeBg} font-semibold`
								: `text-gray-400 border-transparent ${item.hoverColor} hover:bg-white/5`}"
						href="#{item.id}"
						onclick={() => handleNavClick(item.id)}
					>
						<span class="opacity-50 text-[10px]">{item.number}</span>
						{item.label}
					</a>
				{/each}
			</div>

			<!-- CV Button -->
			<button
				onclick={openCvWithLoading}
				disabled={loadingCv}
				class="hidden items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10
					px-4 py-1.5 font-mono text-xs font-bold text-blue-400
					transition-all duration-200 hover:border-blue-400 hover:bg-blue-500/20 hover:text-white
					hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] md:flex disabled:opacity-75 cursor-pointer"
				title="View & Generate CV PDF"
			>
				{#if loadingCv}
					<Icon icon="line-md:loading-loop" class="text-[15px]" />
					<span>Generating...</span>
				{:else}
					<Icon icon="mdi:file-pdf-box" class="text-[16px]" />
					<span>CV</span>
				{/if}
			</button>

			<!-- Mobile toggle -->
			<button
				onclick={toggleMobileMenu}
				class="p-1.5 text-gray-400 hover:text-white transition-colors md:hidden focus:outline-none"
				aria-label="Toggle menu"
			>
				<Icon icon={mobileMenuOpen ? 'lucide:x' : 'lucide:menu'} class="text-xl" />
			</button>
		</div>

		<!-- Mobile dropdown -->
		{#if mobileMenuOpen}
			<div
				class="mt-2 rounded-2xl glass-gradient-border noise relative p-4 md:hidden
					flex flex-col gap-1
					bg-[rgba(10,10,15,0.92)] backdrop-blur-[24px]
					shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
			>
				{#each navItems as item (item.id)}
					{@const isActive = activeSection === item.id}
					<a
						onclick={() => handleNavClick(item.id)}
						class="flex items-center gap-2 font-mono text-sm px-3 py-2.5 rounded-xl border transition-all
							{isActive
								? `${item.activeColor} ${item.activeBg} font-semibold`
								: `text-gray-400 border-transparent ${item.hoverColor} hover:bg-white/5`}"
						href="#{item.id}"
					>
						<span class="opacity-40 text-[10px]">{item.number}</span>
						{item.label}
					</a>
				{/each}

				<button
					onclick={() => { closeMobileMenu(); openCvWithLoading(); }}
					disabled={loadingCv}
					class="mt-2 flex items-center justify-center gap-2 rounded-xl border border-blue-500/25
						bg-blue-500/10 px-4 py-2.5 font-mono text-xs font-bold text-blue-400
						transition-all hover:bg-blue-500/20 hover:text-white disabled:opacity-75 cursor-pointer"
				>
					{#if loadingCv}
						<Icon icon="line-md:loading-loop" class="text-[15px]" />
						<span>Generating...</span>
					{:else}
						<Icon icon="mdi:file-pdf-box" class="text-[16px]" />
						<span>CV</span>
					{/if}
				</button>
			</div>
		{/if}
	</div>
</nav>
