import type { PageServerLoad } from './$types';
import type { HomeSection, ProjectSection, SkillSection, ExperienceSection } from '$lib/supabase/types';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;
	const session = await locals.getSession();

	try {
		// Fetch Home Section
		const { data: home } = await supabase
			.from('home_section')
			.select('*')
			.limit(1)
			.maybeSingle();

		// Fetch Project Section (ordered by display_order ASC)
		const { data: projects } = await supabase
			.from('project_section')
			.select('*')
			.order('display_order', { ascending: true })
			.order('created_at', { ascending: false });

		// Fetch Skill Section (ordered by display_order ASC)
		const { data: skills } = await supabase
			.from('skill_section')
			.select('*')
			.order('display_order', { ascending: true });

		// Fetch Experience Section (ordered by start_date DESC)
		const { data: experiences } = await supabase
			.from('experience_section')
			.select('*')
			.order('start_date', { ascending: false });

		return {
			session,
			home: (home as HomeSection | null),
			projects: (projects as ProjectSection[] | null) ?? [],
			skills: (skills as SkillSection[] | null) ?? [],
			experiences: (experiences as ExperienceSection[] | null) ?? []
		};
	} catch (error) {
		console.error('Error fetching portfolio data from Supabase:', error);
		return {
			session,
			home: null,
			projects: [],
			skills: [],
			experiences: []
		};
	}
};
