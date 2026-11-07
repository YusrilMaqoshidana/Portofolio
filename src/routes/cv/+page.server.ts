import type { PageServerLoad } from './$types';
import type {
	HomeSection,
	ProjectSection,
	SkillSection,
	ExperienceSection,
	EducationSection,
	AchievementSection
} from '$lib/supabase/types';
import {
	defaultHomeData,
	defaultEducationData,
	defaultExperienceData,
	defaultProjectData,
	defaultSkillData,
	defaultAchievementData
} from '$lib/data/cvData';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;
	const session = await locals.getSession();

	try {
		const [homeRes, projectsRes, skillsRes, experiencesRes, educationRes, achievementRes] =
			await Promise.all([
				supabase.from('home_section').select('*').limit(1).maybeSingle(),
				supabase
					.from('project_section')
					.select('*')
					.order('display_order', { ascending: true })
					.order('created_at', { ascending: false }),
				supabase.from('skill_section').select('*').order('display_order', { ascending: true }),
				supabase
					.from('experience_section')
					.select('*')
					.order('display_order', { ascending: true })
					.order('start_date', { ascending: false }),
				supabase.from('education_section').select('*').order('display_order', { ascending: true }),
				supabase.from('achievement_section').select('*').order('display_order', { ascending: true })
			]);

		const home = (homeRes.data as HomeSection | null) || defaultHomeData;
		const projects =
			projectsRes.data && projectsRes.data.length > 0
				? (projectsRes.data as ProjectSection[])
				: defaultProjectData;
		const skills =
			skillsRes.data && skillsRes.data.length > 0
				? (skillsRes.data as SkillSection[])
				: defaultSkillData;
		const experiences =
			experiencesRes.data && experiencesRes.data.length > 0
				? (experiencesRes.data as ExperienceSection[])
				: defaultExperienceData;
		const educations =
			educationRes.data && educationRes.data.length > 0
				? (educationRes.data as EducationSection[])
				: defaultEducationData;
		const achievements =
			achievementRes.data && achievementRes.data.length > 0
				? (achievementRes.data as AchievementSection[])
				: defaultAchievementData;

		return {
			session,
			home,
			projects,
			skills,
			experiences,
			educations,
			achievements
		};
	} catch (error) {
		console.error('Error fetching CV data:', error);
		return {
			session,
			home: defaultHomeData,
			projects: defaultProjectData,
			skills: defaultSkillData,
			experiences: defaultExperienceData,
			educations: defaultEducationData,
			achievements: defaultAchievementData
		};
	}
};
