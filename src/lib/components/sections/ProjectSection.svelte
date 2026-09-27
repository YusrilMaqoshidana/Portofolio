<script lang="ts">
	import type { ProjectSection as ProjectData } from '$lib/supabase/types';
	import { ExternalLink, Github, Star } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		projects?: ProjectData[];
		loading?: boolean;
	}

	let { projects = [], loading = false }: Props = $props();

	const defaultProjects: ProjectData[] = [
		{
			id: '1', title: 'E-Commerce Platform',
			description: 'Full-stack online store with real-time inventory management, Stripe integration, and admin dashboard.',
			thumbnail_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=600&q=80',
			tech_stack: ['SvelteKit', 'Tailwind CSS', 'Supabase', 'Stripe'],
			demo_url: 'https://example.com', repo_url: 'https://github.com',
			is_featured: true, display_order: 1,
			created_at: new Date().toISOString(), updated_at: new Date().toISOString()
		},
		{
			id: '2', title: 'AI Content Generator',
			description: 'SaaS application for AI-powered blog post generation, SEO optimization, and social media posting.',
			thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
			tech_stack: ['TypeScript', 'Next.js', 'OpenAI API', 'PostgreSQL'],
			demo_url: 'https://example.com', repo_url: 'https://github.com',
			is_featured: true, display_order: 2,
			created_at: new Date().toISOString(), updated_at: new Date().toISOString()
		}
	];

	const displayList = $derived(projects.length > 0 ? projects : defaultProjects);
</script>

<section id="projects" class="py-24 px-6 max-w-6xl mx-auto border-t border-white/5 scroll-mt-24">
	<div class="mb-14 text-center" use:reveal>
		<p class="font-mono text-xs text-gray-500 mb-3 tracking-widest uppercase">// 04. work</p>
		<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
			Featured <span class="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Projects</span>
		</h2>
		<p class="mt-3 text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
			A showcase of recent web applications, tools, and side projects built with modern technologies.
		</p>
	</div>

	{#if loading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each [1, 2, 3] as _}
				<div class="rounded-2xl glass overflow-hidden animate-pulse">
					<div class="h-48 bg-white/8 w-full"></div>
					<div class="p-6 space-y-4">
						<div class="h-5 bg-white/8 rounded w-3/4"></div>
						<div class="h-14 bg-white/8 rounded w-full"></div>
						<div class="flex gap-2">
							<div class="h-5 w-16 bg-white/8 rounded-full"></div>
							<div class="h-5 w-16 bg-white/8 rounded-full"></div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each displayList as project, i (project.id)}
				<div
					use:reveal={{ delay: i * 80 }}
					class="group relative glass-gradient-border noise overflow-hidden rounded-2xl flex flex-col
						bg-white/[0.03] hover:bg-white/[0.05]
						transition-all duration-300
						hover:shadow-[0_12px_48px_rgba(0,0,0,0.5),0_0_0_1px_rgba(59,130,246,0.15)]
						hover:-translate-y-1"
				>
					<!-- Thumbnail -->
					<div class="relative h-48 overflow-hidden bg-white/5 shrink-0">
						{#if project.thumbnail_url}
							<img
								src={project.thumbnail_url}
								alt={project.title}
								loading="lazy"
								decoding="async"
								class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
							/>
							<!-- Overlay gradient -->
							<div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent"></div>
						{:else}
							<div class="w-full h-full flex items-center justify-center font-mono text-xs text-gray-600 bg-white/3">
								no_image
							</div>
						{/if}

						{#if project.is_featured}
							<div class="absolute top-3 right-3 px-2 py-1 rounded-full
								bg-amber-500/20 border border-amber-500/40 text-amber-300
								font-mono text-[10px] flex items-center gap-1 backdrop-blur-sm">
								<Star class="w-3 h-3 fill-amber-300" />
								featured
							</div>
						{/if}
					</div>

					<!-- Content -->
					<div class="p-5 space-y-3 flex-1 flex flex-col">
						<h3 class="text-base font-bold text-white group-hover:text-blue-300 transition-colors duration-200">
							{project.title}
						</h3>
						<p class="text-gray-400 text-sm line-clamp-3 leading-relaxed flex-1">
							{project.description}
						</p>

						<!-- Tech stack -->
						{#if project.tech_stack && project.tech_stack.length > 0}
							<div class="flex flex-wrap gap-1.5 pt-1">
								{#each project.tech_stack as tech}
									<span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-gray-400 font-mono text-[10px]">
										{tech}
									</span>
								{/each}
							</div>
						{/if}

						<!-- Links -->
						<div class="flex items-center gap-4 pt-3 mt-auto border-t border-white/5">
							{#if project.demo_url}
								<a
									href={project.demo_url}
									target="_blank" rel="noopener noreferrer"
									class="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-blue-400 hover:text-blue-300 transition-colors"
								>
									<ExternalLink class="w-3.5 h-3.5" />
									live_demo
								</a>
							{/if}
							{#if project.repo_url}
								<a
									href={project.repo_url}
									target="_blank" rel="noopener noreferrer"
									class="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-gray-500 hover:text-gray-300 transition-colors"
								>
									<Github class="w-3.5 h-3.5" />
									source
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
