<script lang="ts">
	import Icon from '@iconify/svelte';

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

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
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
			<div class="hidden items-center gap-8 text-sm font-medium md:flex">
				<a
					class="group flex items-center gap-2 text-gray-400 transition-colors hover:text-primary"
					href="#home"
				>
					<span class="text-primary/50 group-hover:text-primary">01.</span> _home
				</a>
				<a
					class="group flex items-center gap-2 text-gray-400 transition-colors hover:text-code-string"
					href="#skills"
				>
					<span class="text-code-string/50 group-hover:text-code-string">02.</span> _skills
				</a>
				<a
					class="group flex items-center gap-2 text-gray-400 transition-colors hover:text-code-error"
					href="#experience"
				>
					<span class="text-code-error/50 group-hover:text-code-error">03.</span> _experience
				</a>
				<a
					class="group flex items-center gap-2 text-gray-400 transition-colors hover:text-code-func"
					href="#projects"
				>
					<span class="text-code-func/50 group-hover:text-code-func">04.</span> _projects
				</a>
				<a
					class="group flex items-center gap-2 text-gray-400 transition-colors hover:text-code-keyword"
					href="#contact"
				>
					<span class="text-code-keyword/50 group-hover:text-code-keyword">05.</span> _contact
				</a>
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
			<div class="mt-2 rounded-2xl glass-card p-5 border border-white/10 md:hidden flex flex-col space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
				<a
					onclick={closeMobileMenu}
					class="flex items-center gap-2 text-sm text-gray-300 hover:text-primary transition-colors py-1"
					href="#home"
				>
					<span class="text-primary">01.</span> _home
				</a>
				<a
					onclick={closeMobileMenu}
					class="flex items-center gap-2 text-sm text-gray-300 hover:text-code-string transition-colors py-1"
					href="#skills"
				>
					<span class="text-code-string">02.</span> _skills
				</a>
				<a
					onclick={closeMobileMenu}
					class="flex items-center gap-2 text-sm text-gray-300 hover:text-code-error transition-colors py-1"
					href="#experience"
				>
					<span class="text-code-error">03.</span> _experience
				</a>
				<a
					onclick={closeMobileMenu}
					class="flex items-center gap-2 text-sm text-gray-300 hover:text-code-func transition-colors py-1"
					href="#projects"
				>
					<span class="text-code-func">04.</span> _projects
				</a>
				<a
					onclick={closeMobileMenu}
					class="flex items-center gap-2 text-sm text-gray-300 hover:text-code-keyword transition-colors py-1"
					href="#contact"
				>
					<span class="text-code-keyword">05.</span> _contact
				</a>

				{#if resumeLink && resumeLink !== '#'}
					<a
						onclick={closeMobileMenu}
						class="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20
						bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary
						transition-all hover:bg-primary hover:text-white pt-2"
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
