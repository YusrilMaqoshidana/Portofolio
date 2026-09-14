import { logout } from '$lib/supabase/auth.server';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { HomeSection, ProjectSection, SkillSection, ExperienceSection, ContactMessage } from '$lib/supabase/types';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;

	const { data: home } = await supabase.from('home_section').select('*').limit(1).maybeSingle();
	const { data: projects } = await supabase.from('project_section').select('*').order('display_order', { ascending: true });
	const { data: skills } = await supabase.from('skill_section').select('*').order('display_order', { ascending: true });
	const { data: experiences } = await supabase.from('experience_section').select('*').order('start_date', { ascending: false });
	const { data: contactMessages } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });

	return {
		home: (home as HomeSection | null),
		projects: (projects as ProjectSection[] | null) ?? [],
		skills: (skills as SkillSection[] | null) ?? [],
		experiences: (experiences as ExperienceSection[] | null) ?? [],
		contactMessages: (contactMessages as ContactMessage[] | null) ?? []
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

		const social_links = { github, linkedin, instagram, twitter };

		const payload = {
			full_name,
			tagline,
			bio,
			contact_email,
			avatar_url,
			resume_url,
			social_links
		};

		// If no id was passed in form, check if a home_section record already exists in database
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
			let { error } = await locals.supabase.from('home_section').update(payload).eq('id', id);
			if (error) {
				if (error.message.includes('contact_email')) {
					const { contact_email, ...payloadWithoutEmail } = payload;
					const { error: retryErr } = await locals.supabase.from('home_section').update(payloadWithoutEmail).eq('id', id);
					if (retryErr) return fail(400, { error: retryErr.message });
					return fail(400, {
						error: "Kolom 'contact_email' belum dibuat di database Supabase Anda. Silakan jalankan SQL Migration di Supabase SQL Editor."
					});
				}
				return fail(400, { error: error.message });
			}
		} else {
			let { error } = await locals.supabase.from('home_section').insert(payload);
			if (error) {
				if (error.message.includes('contact_email')) {
					const { contact_email, ...payloadWithoutEmail } = payload;
					const { error: retryErr } = await locals.supabase.from('home_section').insert(payloadWithoutEmail);
					if (retryErr) return fail(400, { error: retryErr.message });
					return fail(400, {
						error: "Kolom 'contact_email' belum dibuat di database Supabase Anda. Silakan jalankan SQL Migration di Supabase SQL Editor."
					});
				}
				return fail(400, { error: error.message });
			}
		}

		return { success: true, message: 'Home section updated successfully!' };
	},

	updateContactEmail: async ({ request, locals }) => {
		const formData = await request.formData();
		const contact_email = formData.get('contact_email')?.toString().trim() || '';

		if (!contact_email) return fail(400, { error: 'Contact email address is required' });

		const { data: existing } = await locals.supabase
			.from('home_section')
			.select('id')
			.limit(1)
			.maybeSingle();

		if (existing?.id) {
			const { error } = await locals.supabase.from('home_section').update({ contact_email }).eq('id', existing.id);
			if (error) {
				if (error.message.includes('contact_email')) {
					return fail(400, {
						error: "Kolom 'contact_email' belum dibuat di database Supabase Anda. Silakan jalankan SQL Migration di Supabase SQL Editor."
					});
				}
				return fail(400, { error: error.message });
			}
		} else {
			const { error } = await locals.supabase.from('home_section').insert({ contact_email });
			if (error) {
				if (error.message.includes('contact_email')) {
					return fail(400, {
						error: "Kolom 'contact_email' belum dibuat di database Supabase Anda. Silakan jalankan SQL Migration di Supabase SQL Editor."
					});
				}
				return fail(400, { error: error.message });
			}
		}

		return { success: true, message: 'Contact email updated successfully!' };
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
	},

	saveProject: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const title = formData.get('title')?.toString() || '';
		const description = formData.get('description')?.toString() || '';
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

		const payload = {
			title,
			description,
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
		const category = formData.get('category')?.toString() || 'frontend';
		const proficiency_level = parseInt(formData.get('proficiency_level')?.toString() || '3', 10);
		const icon_url = formData.get('icon_url')?.toString() || '';
		const display_order = parseInt(formData.get('display_order')?.toString() || '0', 10);

		if (!name) return fail(400, { error: 'Skill name is required' });

		const payload = {
			name,
			category,
			proficiency_level,
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
		const description = formData.get('description')?.toString() || '';
		const location = formData.get('location')?.toString() || '';
		const display_order = parseInt(formData.get('display_order')?.toString() || '0', 10);

		if (!role_title || !organization || !start_date) {
			return fail(400, { error: 'Role title, Organization, and Start Date are required' });
		}

		const end_date = end_date_str ? end_date_str : null;

		const payload = {
			role_title,
			organization,
			start_date,
			end_date,
			description,
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
	}
};
