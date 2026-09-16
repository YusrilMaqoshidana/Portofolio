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
		brandLink = 'https://www.linkedin.com/in/moh-yusril-maqoshidana-md36/',
		resumeLink = 'https://drive.google.com/uc?export=download&id=13OGAVHcRqGqpYJBE1AzqITLt4X-vknkY'
	}: Props = $props();

	let mobileMenuOpen = $state(false);
	let activeSection = $state('home');

	const navItems = [
		{
			id: 'home',
			number: '01.',
			label: '_home',
			activeColor: 'text-primary',
			hoverColor: 'hover:text-primary',
			numColorActive: 'text-primary',
			numColorInactive: 'text-primary/50 group-hover:text-primary',
			activeBg: 'bg-primary/10 border-primary/20'
		},
		{
			id: 'skills',
			number: '02.',
			label: '_skills',
			activeColor: 'text-code-string',
			hoverColor: 'hover:text-code-string',
			numColorActive: 'text-code-string',
			numColorInactive: 'text-code-string/50 group-hover:text-code-string',
			activeBg: 'bg-code-string/10 border-code-string/20'
		},
		{
			id: 'experience',
			number: '03.',
			label: '_experience',
			activeColor: 'text-code-error',
			hoverColor: 'hover:text-code-error',
			numColorActive: 'text-code-error',
			numColorInactive: 'text-code-error/50 group-hover:text-code-error',
			activeBg: 'bg-code-error/10 border-code-error/20'
		},
		{
			id: 'projects',
			number: '04.',
			label: '_projects',
			activeColor: 'text-code-func',
			hoverColor: 'hover:text-code-func',
			activeBg: 'bg-code-func/10 border-code-func/20',
			numColorActive: 'text-code-func',
			numColorInactive: 'text-code-func/50 group-hover:text-code-func'
		},
		{
			id: 'contact',
			number: '05.',
			label: '_contact',
			activeColor: 'text-code-keyword',
			hoverColor: 'hover:text-code-keyword',
			numColorActive: 'text-code-keyword',
			numColorInactive: 'text-code-keyword/50 group-hover:text-code-keyword',
			activeBg: 'bg-code-keyword/10 border-code-keyword/20'
		}
	];

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function handleNavClick(id: string) {
		closeMobileMenu();
		activeSection = id;
	}

	onMount(() => {
		if (window.location.hash) {
			const hashId = window.location.hash.replace('#', '');
			if (navItems.some((item) => item.id === hashId)) {
				activeSection = hashId;
			}
		}

		const observerOptions: IntersectionObserverInit = {
			root: null,
			rootMargin: '-20% 0px -50% 0px',
			threshold: 0
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					activeSection = entry.target.id;
				}
			});
		}, observerOptions);

		navItems.forEach((item) => {
			const el = document.getElementById(item.id);
			if (el) observer.observe(el);
		});

		return () => {
			observer.disconnect();
		};
	});
</script>

<nav class="fixed top-0 right-0 left-0 z-50 transition-all duration-300">
	<div class="mx-auto mt-4 max-w-7xl px-4 md:mt-6 md:px-6">
		<div class="glass-card flex items-center justify-between rounded-3xl md:rounded-full px-6 py-3 shadow-2xl">
			<!-- Brand -->
			<a
				class="group flex items-center gap-1 text-xl font-bold tracking-tighter"
				href={brandLink}
				target="_blank"
				rel="noopener noreferrer"
			>
				<span class="text-primary transition-colors group-hover:text-white">&lt;</span>
				<span class="text-white">{brandName}</span>
				<span class="text-primary transition-colors group-hover:text-white">/&gt;</span>
			</a>

			<!-- Desktop Nav Links -->
			<div class="hidden items-center gap-2 text-sm font-medium md:flex">
				{#each navItems as item (item.id)}
					{@const isActive = activeSection === item.id}
					<a
						class="group flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 {isActive
							? `${item.activeColor} ${item.activeBg} font-semibold shadow-sm`
							: `text-gray-400 border-transparent ${item.hoverColor}`}"
						href="#{item.id}"
						onclick={() => handleNavClick(item.id)}
					>
						<span class="transition-colors {isActive ? item.numColorActive : item.numColorInactive}">
							{item.number}
						</span>
						{item.label}
					</a>
				{/each}
			</div>

			<!-- Resume Button -->
			<a
				class="hidden items-center gap-2 rounded-full border border-primary/20
               bg-primary/10 px-4 py-2 text-xs font-bold text-primary
               transition-all hover:border-primary hover:bg-primary
               hover:text-white md:flex"
				href={resumeLink}
				target="_blank"
				rel="noopener noreferrer"
			>
				<Icon icon="mdi:download" class="text-[16px]" />
				Resume.pdf
			</a>

			<!-- Mobile Menu Button -->
			<button
				onclick={toggleMobileMenu}
				class="p-1 text-white md:hidden focus:outline-none"
				aria-label="Toggle menu"
			>
				<Icon icon={mobileMenuOpen ? 'lucide:x' : 'lucide:menu'} class="text-2xl" />
			</button>
		</div>

		<!-- Mobile Dropdown Menu -->
		{#if mobileMenuOpen}
			<div class="mt-2 rounded-2xl glass-card p-5 border border-white/10 md:hidden flex flex-col space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
				{#each navItems as item (item.id)}
					{@const isActive = activeSection === item.id}
					<a
						onclick={() => handleNavClick(item.id)}
						class="flex items-center gap-2 text-sm font-medium transition-all px-3 py-2.5 rounded-xl border {isActive
							? `${item.activeColor} ${item.activeBg} font-semibold`
							: `text-gray-300 border-transparent ${item.hoverColor}`}"
						href="#{item.id}"
					>
						<span class={item.numColorActive}>{item.number}</span>
						{item.label}
					</a>
				{/each}

				{#if resumeLink && resumeLink !== '#'}
					<a
						onclick={closeMobileMenu}
						class="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20
						bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary
						transition-all hover:bg-primary hover:text-white pt-2 mt-2"
						href={resumeLink}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Icon icon="mdi:download" class="text-[16px]" />
						Resume.pdf
					</a>
				{/if}
			</div>
		{/if}
	</div>
</nav>
