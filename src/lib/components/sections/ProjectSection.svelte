<script lang="ts">
	import type { ProjectSection as ProjectData } from '$lib/supabase/types';
	import { ExternalLink, Github, Star, Calendar, Lock, CheckCircle2, Smartphone } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		projects?: ProjectData[];
		loading?: boolean;
	}

	let { projects = [], loading = false }: Props = $props();

	const sortedProjects = $derived.by(() => {
		return [...projects].sort((a, b) => a.display_order - b.display_order);
	});
</script>

<section id="projects" class="py-24 px-6 max-w-6xl mx-auto border-t border-white/5 scroll-mt-24">
	<div class="mb-14 text-center" use:reveal>
		<p class="font-mono text-xs text-gray-500 mb-3 tracking-widest uppercase">// 04. work</p>
		<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
			Project <span class="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Experience</span>
		</h2>
		<p class="mt-3 text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
			Mobile applications, Android solutions, and software systems built with clean code and modern architectures.
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
			{#each sortedProjects as project, i (project.id)}
				<div
					use:reveal={{ delay: i * 80 }}
					class="group relative glass-gradient-border noise overflow-hidden rounded-2xl flex flex-col
						bg-white/[0.03] hover:bg-white/[0.05]
						transition-all duration-300
						hover:shadow-[0_12px_48px_rgba(0,0,0,0.5),0_0_0_1px_rgba(59,130,246,0.15)]
						hover:-translate-y-1"
				>
					<!-- Thumbnail -->
					<div class="relative h-44 overflow-hidden bg-white/5 shrink-0">
						{#if project.thumbnail_url}
							<img
								src={project.thumbnail_url}
								alt={project.title}
								loading="lazy"
								decoding="async"
								class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
							/>
							<!-- Overlay gradient -->
							<div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/90 via-[#0a0a0f]/30 to-transparent"></div>
						{:else}
							<div class="w-full h-full flex flex-col items-center justify-center font-mono text-xs text-gray-500 bg-white/3 gap-2">
								<Smartphone class="w-8 h-8 text-white/20" />
								<span>{project.subtitle || 'Mobile App'}</span>
							</div>
						{/if}

						<div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
							{#if project.subtitle}
								<span class="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-mono text-[10px] backdrop-blur-md">
									{project.subtitle}
								</span>
							{/if}
						</div>

						{#if project.is_featured}
							<div class="absolute top-3 right-3 px-2 py-0.5 rounded-full
								bg-amber-500/20 border border-amber-500/40 text-amber-300
								font-mono text-[10px] flex items-center gap-1 backdrop-blur-md">
								<Star class="w-3 h-3 fill-amber-300" />
								featured
							</div>
						{/if}
					</div>

					<!-- Content -->
					<div class="p-5 space-y-3 flex-1 flex flex-col">
						<div>
							<div class="flex items-center justify-between gap-2 text-xs font-mono text-gray-400 mb-1">
								{#if project.period}
									<span class="inline-flex items-center gap-1 text-[11px]">
										<Calendar class="w-3 h-3 text-amber-400" />
										{project.period}
									</span>
								{/if}
								{#if project.repo_type === 'private'}
									<span class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">
										<Lock class="w-2.5 h-2.5" />
										Private Project
									</span>
								{/if}
							</div>

							<h3 class="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-200">
								{project.title}
							</h3>

							{#if project.role}
								<p class="text-xs font-mono text-blue-400 font-medium mt-0.5">
									{project.role}
								</p>
							{/if}
						</div>

						<!-- Bullet points or Description -->
						{#if project.bullet_points && project.bullet_points.length > 0}
							<ul class="space-y-1.5 text-xs text-gray-300 leading-relaxed flex-1">
								{#each project.bullet_points as bullet}
									<li class="flex items-start gap-1.5">
										<span class="text-blue-400 mt-1 shrink-0">•</span>
										<span>{bullet}</span>
									</li>
								{/each}
							</ul>
						{:else if project.description}
							<p class="text-gray-300 text-xs leading-relaxed flex-1">
								{project.description}
							</p>
						{/if}

						<!-- Tech stack -->
						{#if project.tech_stack && project.tech_stack.length > 0}
							<div class="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
								{#each project.tech_stack as tech}
									<span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-gray-300 font-mono text-[10px]">
										{tech}
									</span>
								{/each}
							</div>
						{/if}

						<!-- Links -->
						<div class="flex items-center justify-between pt-3 mt-auto border-t border-white/5">
							<div class="flex items-center gap-3">
								{#if project.repo_url}
									<a
										href={project.repo_url}
										target="_blank" rel="noopener noreferrer"
										class="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-gray-300 hover:text-white transition-colors"
									>
										<Github class="w-3.5 h-3.5" />
										<span>Repository</span>
									</a>
								{:else if project.repo_type === 'private'}
									<span class="inline-flex items-center gap-1 text-[11px] font-mono text-gray-500">
										<Lock class="w-3 h-3" />
										Private Source
									</span>
								{/if}
							</div>

							{#if project.demo_url}
								<a
									href={project.demo_url}
									target="_blank" rel="noopener noreferrer"
									class="inline-flex items-center gap-1 text-xs font-mono font-medium text-blue-400 hover:text-blue-300 transition-colors"
								>
									<span>Demo</span>
									<ExternalLink class="w-3 h-3" />
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
