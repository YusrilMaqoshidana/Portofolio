<script lang="ts">
	import type { AchievementSection as AchievementData } from '$lib/supabase/types';
	import { Trophy, Calendar, ExternalLink, Award } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		achievements?: AchievementData[];
		loading?: boolean;
	}

	let { achievements = [], loading = false }: Props = $props();

	const sortedAchievements = $derived.by(() => {
		return [...achievements].sort((a, b) => a.display_order - b.display_order);
	});
</script>

<section id="achievements" class="py-24 px-6 max-w-6xl mx-auto border-t border-white/5 scroll-mt-24">
	<div class="mb-14 text-center" use:reveal>
		<p class="font-mono text-xs text-gray-500 mb-3 tracking-widest uppercase">// 06. honors</p>
		<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
			Honors & <span class="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Achievements</span>
		</h2>
		<p class="mt-3 text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
			Recognitions, competition victories, and verified academic distinctions.
		</p>
	</div>

	{#if loading}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
			{#each [1, 2] as _}
				<div class="p-6 rounded-2xl glass space-y-4">
					<div class="h-6 w-3/4 bg-white/8 rounded"></div>
					<div class="h-4 w-1/2 bg-white/8 rounded"></div>
					<div class="h-8 w-28 bg-white/8 rounded"></div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each sortedAchievements as ach, i (ach.id)}
				<div
					use:reveal={{ delay: i * 100 }}
					class="group relative glass-gradient-border noise overflow-hidden rounded-2xl flex flex-col justify-between
						bg-white/[0.03] hover:bg-white/[0.06]
						transition-all duration-300
						hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]
						p-6 md:p-7 space-y-4"
				>
					<div class="space-y-3">
						<div class="flex items-start justify-between gap-3">
							<div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
								<Trophy class="w-5 h-5" />
							</div>
							{#if ach.period}
								<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
									<Calendar class="w-3.5 h-3.5 text-amber-400" />
									{ach.period}
								</span>
							{/if}
						</div>

						<h3 class="text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
							{ach.title}
						</h3>

						{#if ach.description}
							<p class="text-sm text-gray-300 font-mono">
								{ach.description}
							</p>
						{/if}
					</div>

					{#if ach.certificate_url}
						<div class="pt-3 border-t border-white/5">
							<a
								href={ach.certificate_url}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium transition-all"
							>
								<Award class="w-3.5 h-3.5" />
								<span>View Certificate</span>
								<ExternalLink class="w-3 h-3 opacity-70" />
							</a>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>
