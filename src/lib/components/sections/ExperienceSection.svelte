<script lang="ts">
	import type { ExperienceSection as ExperienceData } from '$lib/supabase/types';
	import { Briefcase, Calendar, MapPin } from 'lucide-svelte';

	interface Props {
		experiences?: ExperienceData[];
		loading?: boolean;
	}

	let { experiences = [], loading = false }: Props = $props();

	const defaultExperiences: ExperienceData[] = [
		{
			id: '1',
			role_title: 'Senior Software Engineer',
			organization: 'Tech Innovations Inc.',
			start_date: '2023-01-01',
			end_date: null,
			description: 'Leading frontend development using SvelteKit & TypeScript. Architecting micro-frontends, optimizing web vitals, and mentoring junior engineers.',
			location: 'Jakarta, Indonesia (Remote)',
			display_order: 1,
			created_at: '',
			updated_at: ''
		},
		{
			id: '2',
			role_title: 'Fullstack Web Developer',
			organization: 'Digital Solutions Studio',
			start_date: '2021-06-01',
			end_date: '2022-12-31',
			description: 'Developed responsive web applications for enterprise clients using Vue.js, Laravel, and PostgreSQL. Integrated RESTful APIs and payment gateways.',
			location: 'Bandung, Indonesia',
			display_order: 2,
			created_at: '',
			updated_at: ''
		}
	];

	const sortedExperiences = $derived.by(() => {
		const list = experiences.length > 0 ? [...experiences] : defaultExperiences;
		return list.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
	});

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return 'Present';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
	}
</script>

<section id="experience" class="py-20 px-6 max-w-6xl mx-auto border-t border-white/10">
	<div class="mb-12 text-center">
		<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
			Work <span class="text-primary">Experience</span>
		</h2>
		<p class="mt-3 text-gray-400 max-w-xl mx-auto">
			My professional journey and career milestones in software development.
		</p>
	</div>

	{#if loading}
		<div class="max-w-3xl mx-auto space-y-8 animate-pulse">
			{#each [1, 2] as _}
				<div class="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
					<div class="h-6 w-48 bg-white/10 rounded"></div>
					<div class="h-4 w-32 bg-white/10 rounded"></div>
					<div class="h-16 w-full bg-white/10 rounded"></div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="max-w-3xl mx-auto relative border-l border-white/10 pl-6 md:pl-8 space-y-10 ml-4 md:ml-auto">
			{#each sortedExperiences as exp (exp.id)}
				<div class="relative group">
					<!-- Timeline Indicator Dot -->
					<div class="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-background-dark border-2 border-primary group-hover:bg-primary transition duration-300"></div>

					<div class="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/40 transition duration-300 space-y-4">
						<div class="flex flex-wrap justify-between items-start gap-2">
							<div>
								<h3 class="text-xl font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
									<Briefcase class="w-5 h-5 text-primary" />
									{exp.role_title}
								</h3>
								<p class="text-primary/90 font-medium mt-1">{exp.organization}</p>
							</div>

							<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
								<Calendar class="w-3.5 h-3.5 text-primary" />
								{formatDate(exp.start_date)} - {formatDate(exp.end_date)}
							</div>
						</div>

						{#if exp.location}
							<p class="text-xs text-gray-400 flex items-center gap-1">
								<MapPin class="w-3.5 h-3.5 text-gray-500" />
								{exp.location}
							</p>
						{/if}

						<p class="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
							{exp.description}
						</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
