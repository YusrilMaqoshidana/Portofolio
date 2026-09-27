<script lang="ts">
	import type { SkillSection as SkillData } from '$lib/supabase/types';
	import { Code2, Database, Wrench, Smartphone, Cpu } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		skills?: SkillData[];
		loading?: boolean;
	}

	let { skills = [], loading = false }: Props = $props();

	const defaultSkills: SkillData[] = [
		{ id: '1', name: 'Svelte / SvelteKit',      category: 'frontend', proficiency_level: 5, icon_url: '', display_order: 1, created_at: '', updated_at: '' },
		{ id: '2', name: 'TypeScript / JavaScript', category: 'frontend', proficiency_level: 5, icon_url: '', display_order: 2, created_at: '', updated_at: '' },
		{ id: '3', name: 'Tailwind CSS',             category: 'frontend', proficiency_level: 5, icon_url: '', display_order: 3, created_at: '', updated_at: '' },
		{ id: '4', name: 'Node.js / Express',        category: 'backend',  proficiency_level: 4, icon_url: '', display_order: 4, created_at: '', updated_at: '' },
		{ id: '5', name: 'PostgreSQL / Supabase',    category: 'backend',  proficiency_level: 4, icon_url: '', display_order: 5, created_at: '', updated_at: '' },
		{ id: '6', name: 'Docker / Linux',           category: 'tools',    proficiency_level: 4, icon_url: '', display_order: 6, created_at: '', updated_at: '' },
		{ id: '7', name: 'Git & GitHub Actions',     category: 'tools',    proficiency_level: 5, icon_url: '', display_order: 7, created_at: '', updated_at: '' }
	];

	const skillList = $derived(skills.length > 0 ? skills : defaultSkills);

	const groupedSkills = $derived.by(() => {
		const groups: Record<string, SkillData[]> = {};
		skillList.forEach((skill) => {
			const cat = skill.category ? skill.category.toLowerCase() : 'other';
			if (!groups[cat]) groups[cat] = [];
			groups[cat].push(skill);
		});
		return groups;
	});

	function getCategoryIcon(cat: string) {
		switch (cat) {
			case 'frontend': return Code2;
			case 'backend':  return Database;
			case 'database': return Database;
			case 'mobile':   return Smartphone;
			case 'tools':    return Wrench;
			default:         return Cpu;
		}
	}

	function formatCategory(cat: string) {
		return cat.charAt(0).toUpperCase() + cat.slice(1);
	}

	// Category accent colors
	const catColors: Record<string, string> = {
		frontend: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
		backend:  'text-teal-400 bg-teal-500/10 border-teal-500/20',
		database: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
		mobile:   'text-violet-400 bg-violet-500/10 border-violet-500/20',
		tools:    'text-amber-400 bg-amber-500/10 border-amber-500/20',
		other:    'text-gray-400 bg-gray-500/10 border-gray-500/20',
	};

	const barColors: Record<string, string> = {
		frontend: 'from-blue-500 to-teal-400',
		backend:  'from-teal-500 to-blue-400',
		database: 'from-teal-500 to-blue-400',
		mobile:   'from-violet-500 to-blue-400',
		tools:    'from-amber-500 to-yellow-400',
		other:    'from-gray-500 to-gray-400',
	};
</script>

<section id="skills" class="py-24 px-6 max-w-6xl mx-auto border-t border-white/5 scroll-mt-24">
	<div class="mb-14 text-center" use:reveal>
		<p class="font-mono text-xs text-gray-500 mb-3 tracking-widest uppercase">// 02. expertise</p>
		<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
			Skills & <span class="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">Technologies</span>
		</h2>
		<p class="mt-3 text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
			Technologies, frameworks, and programming languages I work with on a daily basis.
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
				{@const accent = catColors[category] ?? catColors.other}
				{@const bar = barColors[category] ?? barColors.other}
				<div
					use:reveal={{ delay: i * 80 }}
					class="group relative p-6 rounded-2xl glass-gradient-border noise
						bg-white/[0.03] hover:bg-white/[0.06]
						transition-all duration-300
						hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]
						overflow-hidden"
				>
					<!-- Category header -->
					<div class="flex items-center gap-3 pb-5 mb-5 border-b border-white/8">
						<div class="p-2 rounded-lg border {accent}">
							<IconComponent class="w-4 h-4" />
						</div>
						<h3 class="font-mono text-sm font-bold text-white">{formatCategory(category)}</h3>
						<span class="ml-auto font-mono text-xs text-gray-500">{items.length} skills</span>
					</div>

					<!-- Skills list -->
					<div class="space-y-4">
						{#each items as skill (skill.id)}
							<div class="space-y-1.5">
								<div class="flex justify-between items-center">
									<span class="text-sm text-gray-300 font-medium">{skill.name}</span>
									<span class="font-mono text-[10px] text-gray-500">{skill.proficiency_level}/5</span>
								</div>
								<div class="h-1 w-full bg-white/8 rounded-full overflow-hidden">
									<div
										class="h-full bg-gradient-to-r {bar} rounded-full transition-all duration-700"
										style="width: {(skill.proficiency_level / 5) * 100}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
