<script lang="ts">
	import type { EducationSection as EducationData } from '$lib/supabase/types';
	import { GraduationCap, Calendar, Award, BookOpen } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		educations?: EducationData[];
		loading?: boolean;
	}

	let { educations = [], loading = false }: Props = $props();

	const sortedEducations = $derived.by(() => {
		return [...educations].sort((a, b) => a.display_order - b.display_order);
	});
</script>

<section id="education" class="py-24 px-6 max-w-6xl mx-auto border-t border-white/5 scroll-mt-24">
	<div class="mb-14 text-center" use:reveal>
		<p class="font-mono text-xs text-gray-500 mb-3 tracking-widest uppercase">// 02. background</p>
		<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
			Academic <span class="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Education</span>
		</h2>
		<p class="mt-3 text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
			Formal educational background and foundational computer science coursework.
		</p>
	</div>

	{#if loading}
		<div class="max-w-3xl mx-auto space-y-6 animate-pulse">
			<div class="p-8 rounded-2xl glass space-y-4">
				<div class="h-6 w-48 bg-white/8 rounded"></div>
				<div class="h-4 w-32 bg-white/8 rounded"></div>
				<div class="h-16 w-full bg-white/8 rounded"></div>
			</div>
		</div>
	{:else}
		<div class="max-w-3xl mx-auto space-y-6">
			{#each sortedEducations as edu, i (edu.id)}
				<div
					use:reveal={{ delay: i * 100 }}
					class="group relative glass-gradient-border noise overflow-hidden rounded-2xl
						bg-white/[0.03] hover:bg-white/[0.06]
						transition-all duration-300
						hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]
						p-6 md:p-8 space-y-5"
				>
					<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
						<div class="space-y-1">
							<div class="flex items-center gap-2">
								<div class="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
									<GraduationCap class="w-5 h-5" />
								</div>
								<div>
									<h3 class="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
										{edu.institution}
									</h3>
									<p class="text-sm font-medium text-emerald-400 font-mono">
										{edu.degree}
									</p>
								</div>
							</div>
						</div>

						<div class="flex items-center gap-2 self-start">
							<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
								<Calendar class="w-3.5 h-3.5 text-emerald-400" />
								{edu.start_date} – {edu.end_date || 'Present'}
							</span>
						</div>
					</div>

					{#if edu.gpa}
						<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-semibold">
							<Award class="w-4 h-4 text-emerald-400" />
							<span>GPA: {edu.gpa}</span>
						</div>
					{/if}

					{#if edu.coursework}
						<div class="space-y-2 pt-2 border-t border-white/5">
							<div class="flex items-center gap-1.5 text-xs font-mono text-gray-400">
								<BookOpen class="w-3.5 h-3.5 text-emerald-400" />
								<span>Relevant Coursework:</span>
							</div>
							<div class="flex flex-wrap gap-1.5">
								{#each edu.coursework.split(',').map((c) => c.trim()).filter(Boolean) as course}
									<span class="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/8 text-xs text-gray-300 hover:border-emerald-500/30 transition-colors">
										{course}
									</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>
