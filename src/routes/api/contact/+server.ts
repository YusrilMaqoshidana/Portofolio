import { Resend } from 'resend';
import { createSupabaseServerClient } from '$lib/supabase/server';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const resend = new Resend(env.RESEND_API_KEY);
	try {
		const body = await event.request.json();
		const { name, email, subject, message } = body;

		if (!name || !email || !message) {
			return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
		}

		const supabase = createSupabaseServerClient({
			cookies: {
				getAll: () => [],
				setAll: () => {}
			}
		} as any);

		const { data: homeData, error: homeError } = await supabase
			.from('home_section')
			.select('contact_email')
			.single();

		if (homeError || !homeData?.contact_email) {
			return new Response(JSON.stringify({ error: 'Config error' }), { status: 500 });
		}

		const { error } = await resend.emails.send({
			from: 'Portfolio Contact <onboarding@resend.dev>',
			to: [homeData.contact_email],
			subject: `New message: ${subject || 'Portfolio Contact'}`,
			html: `<p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Message:</strong> ${message}</p>`
		});

		if (error) throw error;

		return new Response(JSON.stringify({ success: true }));
	} catch (err) {
		return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
	}
};
