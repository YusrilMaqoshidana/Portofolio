<script lang="ts">
	import type { HomeSection as HomeData } from '$lib/supabase/types';
	import { Github, Linkedin, Instagram, Twitter, FileText, ArrowRight } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		data?: HomeData | null;
		loading?: boolean;
	}

	let { data = null, loading = false }: Props = $props();

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

<section id="home" class="relative min-h-[92vh] flex items-center justify-center py-24 px-6 max-w-6xl mx-auto scroll-mt-24">
	{#if loading}
		<div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center animate-pulse">
			<div class="lg:col-span-7 space-y-6">
				<div class="h-6 w-48 bg-white/8 rounded-full"></div>
				<div class="h-14 w-3/4 bg-white/8 rounded-xl"></div>
				<div class="h-6 w-1/2 bg-white/8 rounded-lg"></div>
				<div class="h-20 w-full bg-white/8 rounded-xl"></div>
				<div class="flex gap-4 pt-4">
					<div class="h-12 w-36 bg-white/8 rounded-xl"></div>
					<div class="h-12 w-36 bg-white/8 rounded-xl"></div>
				</div>
			</div>
			<div class="lg:col-span-5 flex justify-center">
				<div class="w-72 h-72 rounded-full bg-white/8"></div>
			</div>
		</div>
	{:else}
		<div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
			<!-- Text Content -->
			<div class="lg:col-span-7 space-y-7">
				<!-- Status badge -->
				<div use:reveal={{ delay: 0 }}>
					<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-blue-500/20 text-blue-400 text-xs font-mono">
						<span class="relative flex h-2 w-2">
							<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
							<span class="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
						</span>
						available_for_projects
					</div>
				</div>

				<!-- Heading -->
				<div use:reveal={{ delay: 80 }}>
					<p class="font-mono text-xs text-gray-500 mb-2 tracking-widest uppercase">// 01. introduction</p>
					<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
						Hi, I'm<br />
						<span class="bg-gradient-to-r from-blue-400 via-teal-400 to-blue-300 bg-clip-text text-transparent">
							{home.full_name}
						</span>
					</h1>
				</div>

				<!-- Tagline -->
				<div use:reveal={{ delay: 160 }}>
					<p class="text-lg md:text-xl font-medium text-gray-300 font-mono">
						<span class="text-blue-400/60">&gt;</span> {home.tagline}
					</p>
				</div>

				<!-- Bio -->
				<div use:reveal={{ delay: 240 }}>
					<p class="text-gray-400 leading-relaxed max-w-xl text-base md:text-lg">
						{home.bio}
					</p>
				</div>

				<!-- CTAs + socials -->
				<div use:reveal={{ delay: 320 }} class="flex flex-wrap items-center gap-4 pt-2">
					{#if home.resume_url}
						<a
							href={home.resume_url}
							target="_blank"
							rel="noopener noreferrer"
							class="group inline-flex items-center gap-2 px-6 py-3 rounded-xl
								bg-blue-500 text-white font-semibold text-sm
								hover:bg-blue-400 transition-all duration-200
								shadow-[0_0_24px_rgba(59,130,246,0.35)]
								hover:shadow-[0_0_32px_rgba(59,130,246,0.5)]"
						>
							<FileText class="w-4 h-4" />
							View Resume
							<ArrowRight class="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
						</a>
					{/if}

					<a
						href="#projects"
						class="inline-flex items-center gap-2 px-6 py-3 rounded-xl
							glass border-white/10 text-white font-semibold text-sm
							hover:bg-white/8 transition-all duration-200"
					>
						Explore Projects
						<ArrowRight class="w-3.5 h-3.5 opacity-60" />
					</a>

					<!-- Social icons -->
					<div class="flex items-center gap-2 pl-3 border-l border-white/10">
						{#if home.social_links?.github}
							<a
								href={home.social_links.github}
								target="_blank" rel="noopener noreferrer"
								aria-label="GitHub"
								class="p-2.5 rounded-xl glass border-white/8 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200"
							><Github class="w-4 h-4" /></a>
						{/if}
						{#if home.social_links?.linkedin}
							<a
								href={home.social_links.linkedin}
								target="_blank" rel="noopener noreferrer"
								aria-label="LinkedIn"
								class="p-2.5 rounded-xl glass border-white/8 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200"
							><Linkedin class="w-4 h-4" /></a>
						{/if}
						{#if home.social_links?.instagram}
							<a
								href={home.social_links.instagram}
								target="_blank" rel="noopener noreferrer"
								aria-label="Instagram"
								class="p-2.5 rounded-xl glass border-white/8 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200"
							><Instagram class="w-4 h-4" /></a>
						{/if}
						{#if home.social_links?.twitter}
							<a
								href={home.social_links.twitter}
								target="_blank" rel="noopener noreferrer"
								aria-label="Twitter"
								class="p-2.5 rounded-xl glass border-white/8 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200"
							><Twitter class="w-4 h-4" /></a>
						{/if}
					</div>
				</div>
			</div>

			<!-- Avatar -->
			<div class="lg:col-span-5 flex justify-center" use:reveal={{ delay: 200 }}>
				<div class="relative group animate-float">
					<!-- Outer glow ring -->
					<div class="absolute -inset-3 rounded-full bg-gradient-to-br from-blue-500/30 via-teal-400/20 to-violet-500/20 blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 animate-glow-pulse"></div>

					<!-- Gradient border ring -->
					<div class="absolute -inset-[3px] rounded-full bg-gradient-to-br from-blue-400 via-teal-400 to-violet-500 opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>

					<!-- Glass ring -->
					<div class="absolute -inset-[1px] rounded-full glass"></div>

					<!-- Avatar image -->
					<img
						src={home.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
						alt={home.full_name}
						loading="eager"
						fetchpriority="high"
						decoding="async"
						width="320"
						height="320"
						class="relative w-56 h-56 md:w-72 md:h-72 rounded-full object-cover"
					/>
				</div>
			</div>
		</div>
	{/if}
</section>
