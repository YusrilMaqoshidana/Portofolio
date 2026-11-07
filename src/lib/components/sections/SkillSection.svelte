<script lang="ts">
	import type { SkillSection as SkillData } from '$lib/supabase/types';
	import {
		Code2,
		Database,
		Wrench,
		Smartphone,
		Cpu,
		Layers,
		CheckCircle,
		Globe,
		Sparkles
	} from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		skills?: SkillData[];
		loading?: boolean;
	}

	let { skills = [], loading = false }: Props = $props();

	const groupedSkills = $derived.by(() => {
		const groups: Record<string, SkillData[]> = {};
		// Keep custom order if defined
		const desiredOrder = [
			'Programming Languages',
			'Frameworks',
			'Database',
			'Tools',
			'Soft Skills',
			'Languages'
		];

		// Ensure groups exist
		skills.forEach((skill) => {
			const cat = skill.category || 'Other';
			if (!groups[cat]) groups[cat] = [];
			groups[cat].push(skill);
		});

		// Sort items in each group by display_order
		Object.keys(groups).forEach((key) => {
			groups[key].sort((a, b) => a.display_order - b.display_order);
		});

		return groups;
	});

	function getCategoryIcon(cat: string) {
		const lower = cat.toLowerCase();
		if (lower.includes('programming') || lower.includes('code')) return Code2;
		if (lower.includes('framework')) return Smartphone;
		if (lower.includes('database')) return Database;
		if (lower.includes('tool')) return Wrench;
		if (lower.includes('soft') || lower.includes('skill')) return Sparkles;
		if (lower.includes('language')) return Globe;
		return Layers;
	}

	function getCategoryStyles(cat: string) {
		const lower = cat.toLowerCase();
		if (lower.includes('programming')) {
			return {
				accent: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
				bar: 'from-blue-500 to-indigo-400'
			};
		}
		if (lower.includes('framework')) {
			return {
				accent: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
				bar: 'from-teal-500 to-emerald-400'
			};
		}
		if (lower.includes('database')) {
			return {
				accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
				bar: 'from-amber-500 to-yellow-400'
			};
		}
		if (lower.includes('tool')) {
			return {
				accent: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
				bar: 'from-violet-500 to-purple-400'
			};
		}
		if (lower.includes('soft')) {
			return {
				accent: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
				bar: 'from-rose-500 to-pink-400'
			};
		}
		if (lower.includes('language')) {
			return {
				accent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
				bar: 'from-cyan-500 to-blue-400'
			};
		}
		return {
			accent: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
			bar: 'from-gray-500 to-gray-400'
		};
	}
</script>

<section id="skills" class="py-24 px-6 max-w-6xl mx-auto border-t border-white/5 scroll-mt-24">
	<div class="mb-14 text-center" use:reveal>
		<p class="font-mono text-xs text-gray-500 mb-3 tracking-widest uppercase">// 05. expertise</p>
		<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
			Tools & <span class="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">Skills</span>
		</h2>
		<p class="mt-3 text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
			Programming languages, frameworks, development tools, and core competencies.
		</p>
	</div>

	{#if loading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each [1, 2, 3] as _}
				<div class="p-6 rounded-2xl glass animate-pulse space-y-4">
					<div class="h-5 w-28 bg-white/8 rounded"></div>
					<div class="space-y-3">
						<div class="h-3 w-full bg-white/8 rounded-full"></div>
						<div class="h-3 w-3/4 bg-white/8 rounded-full"></div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each Object.entries(groupedSkills) as [category, items], i}
				{@const IconComponent = getCategoryIcon(category)}
				{@const styles = getCategoryStyles(category)}
				<div
					use:reveal={{ delay: i * 80 }}
					class="group relative p-6 rounded-2xl glass-gradient-border noise
						bg-white/[0.03] hover:bg-white/[0.06]
						transition-all duration-300
						hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]
						overflow-hidden"
				>
					<!-- Category header -->
					<div class="flex items-center gap-3 pb-4 mb-4 border-b border-white/8">
						<div class="p-2 rounded-lg border {styles.accent}">
							<IconComponent class="w-4 h-4" />
						</div>
						<h3 class="font-mono text-sm font-bold text-white">{category}</h3>
						<span class="ml-auto font-mono text-xs text-gray-500">{items.length} items</span>
					</div>

					<!-- Skills pill badges -->
					<div class="flex flex-wrap gap-2">
						{#each items as skill (skill.id)}
							<span class="inline-flex items-center px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-200 hover:border-teal-500/30 hover:bg-white/[0.07] transition-all">
								{skill.name}
							</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
