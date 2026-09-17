<script lang="ts">
	import type { ProjectSection as ProjectData } from '$lib/supabase/types';
	import { ExternalLink, Github, Star } from 'lucide-svelte';

	interface Props {
		projects?: ProjectData[];
		loading?: boolean;
	}

	let { projects = [], loading = false }: Props = $props();

	// Default project placeholders if empty
	const defaultProjects: ProjectData[] = [
		{
			id: '1',
			title: 'E-Commerce Platform',
			description: 'Full-stack online store with real-time inventory management, Stripe integration, and admin dashboard.',
			thumbnail_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=600&q=80',
			tech_stack: ['SvelteKit', 'Tailwind CSS', 'Supabase', 'Stripe'],
			demo_url: 'https://example.com',
			repo_url: 'https://github.com',
			is_featured: true,
			display_order: 1,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		},
		{
			id: '2',
			title: 'AI Content Generator',
			description: 'SaaS application for AI-powered blog post generation, SEO optimization, and social media posting.',
			thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
			tech_stack: ['TypeScript', 'Next.js', 'OpenAI API', 'PostgreSQL'],
			demo_url: 'https://example.com',
			repo_url: 'https://github.com',
			is_featured: true,
			display_order: 2,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		}
	];

	const displayList = $derived(projects.length > 0 ? projects : defaultProjects);
</script>

<section id="projects" class="py-20 px-6 max-w-6xl mx-auto border-t border-white/10 scroll-mt-24">
	<div class="mb-12 text-center">
		<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
			Featured <span class="text-primary">Projects</span>
		</h2>
		<p class="mt-3 text-gray-400 max-w-xl mx-auto">
			A showcase of recent web applications, tools, and side projects built with modern technologies.
		</p>
	</div>

	{#if loading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each [1, 2, 3] as _}
				<div class="rounded-2xl border border-white/10 bg-white/5 overflow-hidden animate-pulse">
					<div class="h-48 bg-white/10 w-full"></div>
					<div class="p-6 space-y-4">
						<div class="h-6 bg-white/10 rounded w-3/4"></div>
						<div class="h-16 bg-white/10 rounded w-full"></div>
						<div class="flex gap-2">
							<div class="h-6 w-16 bg-white/10 rounded-full"></div>
							<div class="h-6 w-16 bg-white/10 rounded-full"></div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each displayList as project (project.id)}
				<div class="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-primary/50 transition duration-300 flex flex-col justify-between">
					<div>
						<!-- Thumbnail -->
						<div class="relative h-48 overflow-hidden bg-white/5">
							{#if project.thumbnail_url}
								<img
									src={project.thumbnail_url}
									alt={project.title}
									loading="lazy"
									decoding="async"
									class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
								/>
							{:else}
								<div class="w-full h-full flex items-center justify-center text-gray-500 font-mono text-sm bg-white/5">
									No Image
								</div>
							{/if}

							{#if project.is_featured}
								<div class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1 backdrop-blur-md">
									<Star class="w-3.5 h-3.5 fill-amber-300" />
									Featured
								</div>
							{/if}
						</div>

						<!-- Details -->
						<div class="p-6 space-y-3">
							<h3 class="text-xl font-bold text-white group-hover:text-primary transition-colors">
								{project.title}
							</h3>
							<p class="text-gray-400 text-sm line-clamp-3 leading-relaxed">
								{project.description}
							</p>
						</div>
					</div>

					<div class="p-6 pt-0 space-y-4">
						<!-- Tech Stack Tags -->
						{#if project.tech_stack && project.tech_stack.length > 0}
							<div class="flex flex-wrap gap-2">
								{#each project.tech_stack as tech}
									<span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 text-xs font-medium">
										{tech}
									</span>
								{/each}
							</div>
						{/if}

						<!-- Links -->
						<div class="flex items-center gap-4 pt-2 border-t border-white/5">
							{#if project.demo_url}
								<a
									href={project.demo_url}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
								>
									<ExternalLink class="w-4 h-4" />
									Live Demo
								</a>
							{/if}

							{#if project.repo_url}
								<a
									href={project.repo_url}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
								>
									<Github class="w-4 h-4" />
									Source Code
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
