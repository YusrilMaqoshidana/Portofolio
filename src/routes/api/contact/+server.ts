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
			cookies: { getAll: () => [], setAll: () => {} }
		} as any);

		// Rate limit
		const { data: limit } = await supabase
			.from('contact_limits')
			.select('count, reset_at')
			.eq('email', email)
			.single();

		const nowIso = new Date().toISOString();
		if (limit) {
			const resetAt = new Date(limit.reset_at).getTime();
			if (Date.now() - resetAt > 86400000) {
				await supabase.from('contact_limits').update({ count: 1, reset_at: nowIso }).eq('email', email);
			} else if (limit.count >= 5) {
				return new Response(JSON.stringify({ error: 'Limit reached (max 5 per 24h)' }), { status: 429 });
			} else {
				await supabase.from('contact_limits').update({ count: limit.count + 1 }).eq('email', email);
			}
		} else {
			await supabase.from('contact_limits').insert({ email, count: 1, reset_at: nowIso });
		}

		// Fetch destination email
		const { data: homeData, error: homeError } = await supabase
			.from('home_section')
			.select('contact_email')
			.single();

		if (homeError || !homeData?.contact_email) {
			return new Response(JSON.stringify({ error: 'Config error' }), { status: 500 });
		}

		// Send via Resend using verified domain
		const { error } = await resend.emails.send({
			from: 'Portfolio Contact <contact@yusrilmaqoshidana.my.id>',
			to: [homeData.contact_email],
			reply_to: email,
			subject: `New message from ${name}`,
			html: `<p>${message.replace(/\n/g, '<br>')}</p><p>Reply to: ${email}</p>`
		});

		if (error) throw error;

		return new Response(JSON.stringify({ success: true }));
	} catch (err: any) {
		console.error('Contact API error:', err);
		return new Response(JSON.stringify({ error: err.message || 'Server error' }), { status: 500 });
	}
};
