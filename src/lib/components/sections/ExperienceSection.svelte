<script lang="ts">
	import type { ExperienceSection as ExperienceData } from '$lib/supabase/types';
	import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		experiences?: ExperienceData[];
		loading?: boolean;
	}

	let { experiences = [], loading = false }: Props = $props();

	const sortedExperiences = $derived.by(() => {
		return [...experiences].sort((a, b) => {
			if (a.display_order !== b.display_order) {
				return a.display_order - b.display_order;
			}
			return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
		});
	});

	function formatDisplayDate(exp: ExperienceData): string {
		if (exp.period_text) return exp.period_text;
		const start = exp.start_date ? new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
		const end = exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';
		return `${start} — ${end}`;
	}

	function isPresent(exp: ExperienceData): boolean {
		if (exp.period_text) return exp.period_text.toLowerCase().includes('present');
		return !exp.end_date;
	}
</script>

<section id="experience" class="py-24 px-6 max-w-6xl mx-auto border-t border-white/5 scroll-mt-24">
	<div class="mb-14 text-center" use:reveal>
		<p class="font-mono text-xs text-gray-500 mb-3 tracking-widest uppercase">// 03. career</p>
		<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
			Working <span class="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">Experience</span>
		</h2>
		<p class="mt-3 text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
			Professional experience in mobile software development, programs, and engineering initiatives.
		</p>
	</div>

	{#if loading}
		<div class="max-w-3xl mx-auto space-y-6 animate-pulse">
			{#each [1, 2] as _}
				<div class="p-6 rounded-2xl glass space-y-4">
					<div class="h-6 w-48 bg-white/8 rounded"></div>
					<div class="h-4 w-32 bg-white/8 rounded"></div>
					<div class="h-16 w-full bg-white/8 rounded"></div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="max-w-3xl mx-auto">
			<!-- Timeline -->
			<div class="relative pl-8 space-y-8">
				<!-- Vertical line -->
				<div class="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500/60 via-white/10 to-transparent"></div>

				{#each sortedExperiences as exp, i (exp.id)}
					<div class="relative" use:reveal={{ delay: i * 100 }}>
						<!-- Timeline dot -->
						<div class="absolute -left-8 top-5 w-3.5 h-3.5 rounded-full
							{isPresent(exp)
								? 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)] ring-2 ring-blue-400/30'
								: 'bg-white/20 ring-2 ring-white/10'}
							transition-all duration-300">
						</div>

						<!-- Card -->
						<div class="group relative glass-gradient-border noise overflow-hidden rounded-2xl
							bg-white/[0.03] hover:bg-white/[0.06]
							transition-all duration-300
							hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]
							p-6 space-y-4">

							<div class="flex flex-wrap justify-between items-start gap-3">
								<div>
									<div class="flex items-center gap-2 mb-1">
										{#if isPresent(exp)}
											<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px]">
												<span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
												current
											</span>
										{/if}
									</div>
									<h3 class="text-lg font-bold text-white flex items-center gap-2">
										<Briefcase class="w-4 h-4 text-blue-400 shrink-0" />
										{exp.role_title}
									</h3>
									<p class="text-blue-400/90 font-medium text-sm mt-0.5">{exp.organization}</p>
								</div>

								<div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border-white/8 text-xs font-mono text-gray-300 shrink-0">
									<Calendar class="w-3 h-3 text-blue-400" />
									{formatDisplayDate(exp)}
								</div>
							</div>

							{#if exp.location}
								<p class="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
									<MapPin class="w-3.5 h-3.5 text-gray-500" />
									{exp.location}
								</p>
							{/if}

							{#if exp.bullet_points && exp.bullet_points.length > 0}
								<ul class="space-y-2 text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3">
									{#each exp.bullet_points as bullet}
										<li class="flex items-start gap-2">
											<span class="text-blue-400 mt-1 shrink-0">•</span>
											<span>{bullet}</span>
										</li>
									{/each}
								</ul>
							{:else if exp.description}
								<p class="text-gray-300 text-sm leading-relaxed whitespace-pre-line border-t border-white/5 pt-3">
									{exp.description}
								</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</section>
