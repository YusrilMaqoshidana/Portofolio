<script lang="ts">
	import type { SkillSection as SkillData } from '$lib/supabase/types';
	import { Code2, Database, Wrench, Smartphone, Cpu } from 'lucide-svelte';

	interface Props {
		skills?: SkillData[];
		loading?: boolean;
	}

	let { skills = [], loading = false }: Props = $props();

	const defaultSkills: SkillData[] = [
		{ id: '1', name: 'Svelte / SvelteKit', category: 'frontend', proficiency_level: 5, icon_url: '', display_order: 1, created_at: '', updated_at: '' },
		{ id: '2', name: 'TypeScript / JavaScript', category: 'frontend', proficiency_level: 5, icon_url: '', display_order: 2, created_at: '', updated_at: '' },
		{ id: '3', name: 'Tailwind CSS', category: 'frontend', proficiency_level: 5, icon_url: '', display_order: 3, created_at: '', updated_at: '' },
		{ id: '4', name: 'Node.js / Express', category: 'backend', proficiency_level: 4, icon_url: '', display_order: 4, created_at: '', updated_at: '' },
		{ id: '5', name: 'PostgreSQL / Supabase', category: 'backend', proficiency_level: 4, icon_url: '', display_order: 5, created_at: '', updated_at: '' },
		{ id: '6', name: 'Docker / Linux', category: 'tools', proficiency_level: 4, icon_url: '', display_order: 6, created_at: '', updated_at: '' },
		{ id: '7', name: 'Git & GitHub Actions', category: 'tools', proficiency_level: 5, icon_url: '', display_order: 7, created_at: '', updated_at: '' }
	];

	const skillList = $derived(skills.length > 0 ? skills : defaultSkills);

	// Group skills by category
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
			case 'backend': return Database;
			case 'database': return Database;
			case 'mobile': return Smartphone;
			case 'tools': return Wrench;
			default: return Cpu;
		}
	}

	function formatCategory(cat: string) {
		return cat.charAt(0).toUpperCase() + cat.slice(1);
	}
</script>

<section id="skills" class="py-20 px-6 max-w-6xl mx-auto border-t border-white/10">
	<div class="mb-12 text-center">
		<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
			Skills & <span class="text-primary">Technologies</span>
		</h2>
		<p class="mt-3 text-gray-400 max-w-xl mx-auto">
			Technologies, frameworks, and programming languages I work with on a daily basis.
		</p>
	</div>

	{#if loading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each [1, 2, 3] as _}
				<div class="p-6 rounded-2xl border border-white/10 bg-white/5 animate-pulse space-y-4">
					<div class="h-6 w-32 bg-white/10 rounded"></div>
					<div class="h-4 w-full bg-white/10 rounded"></div>
					<div class="h-4 w-3/4 bg-white/10 rounded"></div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each Object.entries(groupedSkills) as [category, items]}
				{@const IconComponent = getCategoryIcon(category)}
				<div class="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6">
					<div class="flex items-center gap-3 border-b border-white/10 pb-4">
						<div class="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
							<IconComponent class="w-5 h-5" />
						</div>
						<h3 class="text-xl font-bold text-white">{formatCategory(category)}</h3>
					</div>

					<div class="space-y-4">
						{#each items as skill (skill.id)}
							<div class="space-y-2">
								<div class="flex justify-between items-center text-sm">
									<span class="font-medium text-gray-200">{skill.name}</span>
									<span class="text-xs text-gray-400">Level {skill.proficiency_level}/5</span>
								</div>
								<div class="h-2 w-full bg-white/10 rounded-full overflow-hidden">
									<div
										class="h-full bg-gradient-to-r from-primary to-teal-400 rounded-full"
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
