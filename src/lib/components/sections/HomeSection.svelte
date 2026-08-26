<script lang="ts">
	import type { HomeSection as HomeData } from '$lib/supabase/types';
	import { Github, Linkedin, Instagram, Twitter, FileText, ArrowRight } from 'lucide-svelte';

	interface Props {
		data?: HomeData | null;
		loading?: boolean;
	}

	let { data = null, loading = false }: Props = $props();

	// Default fallback data if database is empty or loading
	const home = $derived(
		data ?? {
			id: '',
			updated_at: '',
			full_name: 'Yusril Maqoshidana',
			tagline: 'Fullstack Developer & Software Engineer',
			bio: 'Building modern web applications, scalable backends, and beautiful user interfaces with Svelte, React, Node.js, and Cloud services.',
			avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
			resume_url: '#',
			social_links: {
				github: 'https://github.com',
				linkedin: 'https://linkedin.com',
				instagram: 'https://instagram.com',
				twitter: ''
			}
		}
	);
</script>

<section id="home" class="relative min-h-[90vh] flex items-center justify-center py-20 px-6 max-w-6xl mx-auto">
	{#if loading}
		<!-- Skeleton Loader -->
		<div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center animate-pulse">
			<div class="lg:col-span-7 space-y-6">
				<div class="h-6 w-48 bg-white/10 rounded-full"></div>
				<div class="h-12 w-3/4 bg-white/10 rounded-lg"></div>
				<div class="h-20 w-full bg-white/10 rounded-lg"></div>
				<div class="flex gap-4 pt-4">
					<div class="h-12 w-36 bg-white/10 rounded-xl"></div>
					<div class="h-12 w-36 bg-white/10 rounded-xl"></div>
				</div>
			</div>
			<div class="lg:col-span-5 flex justify-center">
				<div class="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/10"></div>
			</div>
		</div>
	{:else}
		<div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
			<!-- Text Content -->
			<div class="lg:col-span-7 space-y-6">
				<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
					<span class="relative flex h-2 w-2">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
						<span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
					</span>
					Available for new projects
				</div>

				<h1 class="text-4xl md:text-6xl font-bold tracking-tight text-white">
					Hi, I'm <span class="bg-gradient-to-r from-primary via-teal-400 to-emerald-400 bg-clip-text text-transparent">{home.full_name}</span>
				</h1>

				<p class="text-xl md:text-2xl font-medium text-gray-300">
					{home.tagline}
				</p>

				<p class="text-gray-400 leading-relaxed max-w-2xl text-base md:text-lg">
					{home.bio}
				</p>

				<!-- CTAs and Social Links -->
				<div class="flex flex-wrap items-center gap-4 pt-4">
					{#if home.resume_url}
						<a
							href={home.resume_url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
						>
							<FileText class="w-5 h-5" />
							View Resume
						</a>
					{/if}

					<a
						href="#projects"
						class="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
					>
						Explore Projects
						<ArrowRight class="w-4 h-4" />
					</a>

					<!-- Social Icons -->
					<div class="flex items-center gap-3 ml-2 border-l border-white/10 pl-4">
						{#if home.social_links?.github}
							<a
								href={home.social_links.github}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="GitHub"
								class="p-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
							>
								<Github class="w-5 h-5" />
							</a>
						{/if}

						{#if home.social_links?.linkedin}
							<a
								href={home.social_links.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="LinkedIn"
								class="p-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
							>
								<Linkedin class="w-5 h-5" />
							</a>
						{/if}

						{#if home.social_links?.instagram}
							<a
								href={home.social_links.instagram}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
								class="p-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
							>
								<Instagram class="w-5 h-5" />
							</a>
						{/if}

						{#if home.social_links?.twitter}
							<a
								href={home.social_links.twitter}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Twitter"
								class="p-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
							>
								<Twitter class="w-5 h-5" />
							</a>
						{/if}
					</div>
				</div>
			</div>

			<!-- Avatar -->
			<div class="lg:col-span-5 flex justify-center">
				<div class="relative group">
					<div class="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-teal-500 blur-xl opacity-30 group-hover:opacity-60 transition duration-500"></div>
					<img
						src={home.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
						alt={home.full_name}
						class="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-white/10 shadow-2xl"
					/>
				</div>
			</div>
		</div>
	{/if}
</section>
