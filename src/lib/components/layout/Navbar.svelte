<script lang="ts">
	import Icon from '@iconify/svelte';

	export let brandName = 'Yusril';
	export let brandLink = 'https://www.linkedin.com/in/moh-yusril-maqoshidana-md36/';
	export let resumeLink =
		'https://drive.google.com/uc?export=download&id=13OGAVHcRqGqpYJBE1AzqITLt4X-vknkY';
</script>

<nav class="fixed top-0 right-0 left-0 z-50 transition-all duration-300">
	<div class="mx-auto mt-6 max-w-7xl px-6">
		<div class="glass-card flex items-center justify-between rounded-full px-6 py-3 shadow-2xl">
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

			<div class="hidden items-center gap-8 text-sm font-medium md:flex">
				<a
					class="group flex items-center gap-2 text-gray-400 transition-colors hover:text-primary"
					href="#hero"
				>
					<span class="text-primary/50 group-hover:text-primary">01.</span> _home
				</a>
				<a
					class="group flex items-center gap-2 text-gray-400 transition-colors hover:text-code-string"
					href="#about"
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
			<button class="p-1 text-white md:hidden" aria-label="Open menu">
				<span class="material-symbols-outlined">menu</span>
			</button>
		</div>
	</div>
</nav>
