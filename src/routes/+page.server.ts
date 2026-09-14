import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { HomeSection, ProjectSection, SkillSection, ExperienceSection } from '$lib/supabase/types';
import { sendContactNotificationEmail } from '$lib/server/postmark';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;
	const session = await locals.getSession();

	try {
		// Fetch all sections in parallel to significantly reduce server response time
		const [homeRes, projectsRes, skillsRes, experiencesRes] = await Promise.all([
			supabase.from('home_section').select('*').limit(1).maybeSingle(),
			supabase.from('project_section').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: false }),
			supabase.from('skill_section').select('*').order('display_order', { ascending: true }),
			supabase.from('experience_section').select('*').order('start_date', { ascending: false })
		]);

		const home = homeRes.data;
		const projects = projectsRes.data;
		const skills = skillsRes.data;
		const experiences = experiencesRes.data;

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

export const actions: Actions = {
	sendContact: async ({ request, locals }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() || '';
		const email = formData.get('email')?.toString().trim() || '';
		const subject = formData.get('subject')?.toString().trim() || '';
		const message = formData.get('message')?.toString().trim() || '';

		if (!name || !email || !message) {
			return fail(400, { contactError: 'Nama, Email, dan Pesan wajib diisi.' });
		}

		// Basic email format check
		if (!email.includes('@') || !email.includes('.')) {
			return fail(400, { contactError: 'Format alamat email tidak valid.' });
		}

		// 1. Save contact message to Supabase DB
		const { error } = await locals.supabase.from('contact_messages').insert({
			name,
			email,
			subject,
			message
		});

		if (error) {
			console.error('Error saving contact message to Supabase:', error);
			return fail(400, { contactError: 'Gagal menyimpan pesan: ' + error.message });
		}

		// 2. Fetch destination email address from home_section
		const { data: home } = await locals.supabase.from('home_section').select('contact_email').limit(1).maybeSingle();
		const targetEmail = home?.contact_email || 'yusril.maqoshidana@gmail.com';

		// 3. Send email notification via Postmark
		await sendContactNotificationEmail({
			toEmail: targetEmail,
			senderName: name,
			senderEmail: email,
			subject,
			message
		});

		return { contactSuccess: true, contactMessage: 'Pesan Anda telah berhasil dikirim dan email notifikasi telah diteruskan!' };
	}
};
