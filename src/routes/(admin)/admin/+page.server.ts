import { logout } from '$lib/supabase/auth.server';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type {
	HomeSection,
	ProjectSection,
	SkillSection,
	ExperienceSection,
	EducationSection,
	AchievementSection,
	ContactMessage
} from '$lib/supabase/types';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;

	const [
		homeRes,
		projectsRes,
		skillsRes,
		experiencesRes,
		educationsRes,
		achievementsRes,
		contactMessagesRes
	] = await Promise.all([
		supabase.from('home_section').select('*').limit(1).maybeSingle(),
		supabase.from('project_section').select('*').order('display_order', { ascending: true }),
		supabase.from('skill_section').select('*').order('display_order', { ascending: true }),
		supabase.from('experience_section').select('*').order('display_order', { ascending: true }).order('start_date', { ascending: false }),
		supabase.from('education_section').select('*').order('display_order', { ascending: true }),
		supabase.from('achievement_section').select('*').order('display_order', { ascending: true }),
		supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
	]);

	return {
		home: (homeRes.data as HomeSection | null),
		projects: (projectsRes.data as ProjectSection[] | null) ?? [],
		skills: (skillsRes.data as SkillSection[] | null) ?? [],
		experiences: (experiencesRes.data as ExperienceSection[] | null) ?? [],
		educations: (educationsRes.data as EducationSection[] | null) ?? [],
		achievements: (achievementsRes.data as AchievementSection[] | null) ?? [],
		contactMessages: (contactMessagesRes.data as ContactMessage[] | null) ?? []
	};
};

export const actions: Actions = {
	logout: async (event) => {
		const result = await logout(event);
		if (!result.success) {
			return fail(400, { error: result.error || 'Logout failed' });
		}
		throw redirect(303, '/');
	},

	updateHome: async ({ request, locals }) => {
		const formData = await request.formData();
		let id = formData.get('id')?.toString();
		const full_name = formData.get('full_name')?.toString() || '';
		const tagline = formData.get('tagline')?.toString() || '';
		const bio = formData.get('bio')?.toString() || '';
		const contact_email = formData.get('contact_email')?.toString() || '';
		const location = formData.get('location')?.toString() || '';
		const whatsapp_url = formData.get('whatsapp_url')?.toString() || '';
		let avatar_url = formData.get('avatar_url')?.toString() || '';
		let resume_url = formData.get('resume_url')?.toString() || '';
		const github = formData.get('github')?.toString() || '';
		const linkedin = formData.get('linkedin')?.toString() || '';
		const instagram = formData.get('instagram')?.toString() || '';
		const twitter = formData.get('twitter')?.toString() || '';

		const avatarFile = formData.get('avatar_file') as File | null;
		const resumeFile = formData.get('resume_file') as File | null;

		// Upload avatar if file is provided
		if (avatarFile && avatarFile.size > 0) {
			const ext = avatarFile.name.split('.').pop() || 'png';
			const path = `avatar_${Date.now()}.${ext}`;
			const { data: uploadData, error: uploadErr } = await locals.supabase.storage
				.from('avatars')
				.upload(path, avatarFile, { upsert: true });

			if (!uploadErr && uploadData) {
				const { data: publicUrlData } = locals.supabase.storage.from('avatars').getPublicUrl(uploadData.path);
				avatar_url = publicUrlData.publicUrl;
			}
		}

		// Upload resume if file is provided
		if (resumeFile && resumeFile.size > 0) {
			const ext = resumeFile.name.split('.').pop() || 'pdf';
			const path = `resume_${Date.now()}.${ext}`;
			const { data: uploadData, error: uploadErr } = await locals.supabase.storage
				.from('resumes')
				.upload(path, resumeFile, { upsert: true });

			if (!uploadErr && uploadData) {
				const { data: publicUrlData } = locals.supabase.storage.from('resumes').getPublicUrl(uploadData.path);
				resume_url = publicUrlData.publicUrl;
			}
		}

		const social_links = { github, linkedin, instagram, twitter, whatsapp: whatsapp_url };

		const payload: any = {
			full_name,
			tagline,
			bio,
			contact_email,
			location,
			whatsapp_url,
			avatar_url,
			resume_url,
			social_links
		};

		// If no id was passed in form, check if a home_section record already exists
		if (!id) {
			const { data: existing } = await locals.supabase
				.from('home_section')
				.select('id')
				.limit(1)
				.maybeSingle();
			if (existing?.id) {
				id = existing.id;
			}
		}

		if (id) {
			const { error } = await locals.supabase.from('home_section').update(payload).eq('id', id);
			if (error) return fail(400, { error: error.message });
		} else {
			const { error } = await locals.supabase.from('home_section').insert(payload);
			if (error) return fail(400, { error: error.message });
		}

		return { success: true, message: 'Profile & Home section updated successfully!' };
	},

	saveEducation: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const institution = formData.get('institution')?.toString() || '';
		const degree = formData.get('degree')?.toString() || '';
		const start_date = formData.get('start_date')?.toString() || '';
		const end_date = formData.get('end_date')?.toString() || 'Present';
		const gpa = formData.get('gpa')?.toString() || '';
		const coursework = formData.get('coursework')?.toString() || '';
		const display_order = parseInt(formData.get('display_order')?.toString() || '0', 10);

		if (!institution || !degree) {
			return fail(400, { error: 'Institution and Degree are required' });
		}

		const payload = {
			institution,
			degree,
			start_date,
			end_date,
			gpa,
			coursework,
			display_order
		};

		if (id) {
			const { error } = await locals.supabase.from('education_section').update(payload).eq('id', id);
			if (error) return fail(400, { error: error.message });
		} else {
			const { error } = await locals.supabase.from('education_section').insert(payload);
			if (error) return fail(400, { error: error.message });
		}

		return { success: true, message: 'Education saved successfully!' };
	},

	deleteEducation: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'Invalid ID' });

		const { error } = await locals.supabase.from('education_section').delete().eq('id', id);
		if (error) return fail(400, { error: error.message });

		return { success: true, message: 'Education deleted successfully!' };
	},

	saveAchievement: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const title = formData.get('title')?.toString() || '';
		const period = formData.get('period')?.toString() || '';
		const description = formData.get('description')?.toString() || '';
		const certificate_url = formData.get('certificate_url')?.toString() || '';
		const display_order = parseInt(formData.get('display_order')?.toString() || '0', 10);

		if (!title) return fail(400, { error: 'Title is required' });

		const payload = {
			title,
			period,
			description,
			certificate_url,
			display_order
		};

		if (id) {
			const { error } = await locals.supabase.from('achievement_section').update(payload).eq('id', id);
			if (error) return fail(400, { error: error.message });
		} else {
			const { error } = await locals.supabase.from('achievement_section').insert(payload);
			if (error) return fail(400, { error: error.message });
		}

		return { success: true, message: 'Achievement saved successfully!' };
	},

	deleteAchievement: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'Invalid ID' });

		const { error } = await locals.supabase.from('achievement_section').delete().eq('id', id);
		if (error) return fail(400, { error: error.message });

		return { success: true, message: 'Achievement deleted successfully!' };
	},

	saveProject: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const title = formData.get('title')?.toString() || '';
		const subtitle = formData.get('subtitle')?.toString() || '';
		const role = formData.get('role')?.toString() || '';
		const period = formData.get('period')?.toString() || '';
		const repo_type = formData.get('repo_type')?.toString() || 'public';
		const description = formData.get('description')?.toString() || '';
		const bullets_raw = formData.get('bullet_points')?.toString() || '';
		let thumbnail_url = formData.get('thumbnail_url')?.toString() || '';
		const tech_stack_str = formData.get('tech_stack')?.toString() || '';
		const demo_url = formData.get('demo_url')?.toString() || '';
		const repo_url = formData.get('repo_url')?.toString() || '';
		const is_featured = formData.get('is_featured') === 'on' || formData.get('is_featured') === 'true';
		const display_order = parseInt(formData.get('display_order')?.toString() || '0', 10);

		if (!title) return fail(400, { error: 'Project title is required' });

		const thumbnailFile = formData.get('thumbnail_file') as File | null;
		if (thumbnailFile && thumbnailFile.size > 0) {
			const ext = thumbnailFile.name.split('.').pop() || 'png';
			const path = `thumb_${Date.now()}.${ext}`;
			const { data: uploadData, error: uploadErr } = await locals.supabase.storage
				.from('thumbnails')
				.upload(path, thumbnailFile, { upsert: true });

			if (!uploadErr && uploadData) {
				const { data: publicUrlData } = locals.supabase.storage.from('thumbnails').getPublicUrl(uploadData.path);
				thumbnail_url = publicUrlData.publicUrl;
			}
		}

		const tech_stack = tech_stack_str
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);

		const bullet_points = bullets_raw
			.split('\n')
			.map((b) => b.trim().replace(/^[-•*]\s*/, ''))
			.filter(Boolean);

		const payload: any = {
			title,
			subtitle,
			role,
			period,
			repo_type,
			description,
			bullet_points,
			thumbnail_url,
			tech_stack,
			demo_url,
			repo_url,
			is_featured,
			display_order
		};

		if (id) {
			const { error } = await locals.supabase.from('project_section').update(payload).eq('id', id);
			if (error) return fail(400, { error: error.message });
		} else {
			const { error } = await locals.supabase.from('project_section').insert(payload);
			if (error) return fail(400, { error: error.message });
		}

		return { success: true, message: 'Project saved successfully!' };
	},

	deleteProject: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'Invalid ID' });

		const { error } = await locals.supabase.from('project_section').delete().eq('id', id);
		if (error) return fail(400, { error: error.message });

		return { success: true, message: 'Project deleted successfully!' };
	},

	saveSkill: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const name = formData.get('name')?.toString() || '';
		const category = formData.get('category')?.toString() || 'Programming Languages';
		const icon_url = formData.get('icon_url')?.toString() || '';
		const display_order = parseInt(formData.get('display_order')?.toString() || '0', 10);

		if (!name) return fail(400, { error: 'Skill name is required' });

		const payload: any = {
			name,
			category,
			icon_url,
			display_order
		};

		if (id) {
			const { error } = await locals.supabase.from('skill_section').update(payload).eq('id', id);
			if (error) return fail(400, { error: error.message });
		} else {
			const { error } = await locals.supabase.from('skill_section').insert(payload);
			if (error) return fail(400, { error: error.message });
		}

		return { success: true, message: 'Skill saved successfully!' };
	},

	deleteSkill: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'Invalid ID' });

		const { error } = await locals.supabase.from('skill_section').delete().eq('id', id);
		if (error) return fail(400, { error: error.message });

		return { success: true, message: 'Skill deleted successfully!' };
	},

	saveExperience: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const role_title = formData.get('role_title')?.toString() || '';
		const organization = formData.get('organization')?.toString() || '';
		const start_date = formData.get('start_date')?.toString() || '';
		const end_date_str = formData.get('end_date')?.toString() || '';
		const period_text = formData.get('period_text')?.toString() || '';
		const description = formData.get('description')?.toString() || '';
		const bullets_raw = formData.get('bullet_points')?.toString() || '';
		const location = formData.get('location')?.toString() || '';
		const display_order = parseInt(formData.get('display_order')?.toString() || '0', 10);

		if (!role_title || !organization) {
			return fail(400, { error: 'Role title and Organization are required' });
		}

		const end_date = end_date_str ? end_date_str : null;
		const bullet_points = bullets_raw
			.split('\n')
			.map((b) => b.trim().replace(/^[-•*]\s*/, ''))
			.filter(Boolean);

		const payload: any = {
			role_title,
			organization,
			start_date: start_date || '2024-01-01',
			end_date,
			period_text,
			description,
			bullet_points,
			location,
			display_order
		};

		if (id) {
			const { error } = await locals.supabase.from('experience_section').update(payload).eq('id', id);
			if (error) return fail(400, { error: error.message });
		} else {
			const { error } = await locals.supabase.from('experience_section').insert(payload);
			if (error) return fail(400, { error: error.message });
		}

		return { success: true, message: 'Experience saved successfully!' };
	},

	deleteExperience: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'Invalid ID' });

		const { error } = await locals.supabase.from('experience_section').delete().eq('id', id);
		if (error) return fail(400, { error: error.message });

		return { success: true, message: 'Experience deleted successfully!' };
	},

	toggleReadMessage: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const is_read = formData.get('is_read') === 'true';

		if (!id) return fail(400, { error: 'Invalid message ID' });

		const { error } = await locals.supabase.from('contact_messages').update({ is_read: !is_read }).eq('id', id);
		if (error) return fail(400, { error: error.message });

		return { success: true, message: 'Message status updated!' };
	},

	deleteMessage: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) return fail(400, { error: 'Invalid message ID' });

		const { error } = await locals.supabase.from('contact_messages').delete().eq('id', id);
		if (error) return fail(400, { error: error.message });

		return { success: true, message: 'Message deleted successfully!' };
	}
};
