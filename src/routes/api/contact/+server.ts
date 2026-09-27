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

		// 1. Cek atau Reset limit
		const { data: limit, error: limitError } = await supabase
			.from('contact_limits')
			.select('count, reset_at')
			.eq('email', email)
			.single();

		let currentCount = 0;
		const now = new Date().toISOString();

		if (limit) {
			const resetAt = new Date(limit.reset_at).getTime();
			// Reset jika sudah > 24 jam (86400000 ms)
			if (Date.now() - resetAt > 86400000) {
				await supabase.from('contact_limits').update({ count: 1, reset_at: now }).eq('email', email);
				currentCount = 1;
			} else {
				if (limit.count >= 5) {
					return new Response(JSON.stringify({ error: 'Limit reached (max 5 per 24h)' }), { status: 429 });
				}
				await supabase.from('contact_limits').update({ count: limit.count + 1 }).eq('email', email);
				currentCount = limit.count + 1;
			}
		} else {
			await supabase.from('contact_limits').insert({ email, count: 1, reset_at: now });
			currentCount = 1;
		}

		// 2. Fetch destination email
		const { data: homeData, error: homeError } = await supabase
			.from('home_section')
			.select('contact_email')
			.single();

		if (homeError || !homeData?.contact_email) {
			return new Response(JSON.stringify({ error: 'Config error' }), { status: 500 });
		}

		// 3. Send via Resend
		const { error } = await resend.emails.send({
			from: 'Portfolio Contact <onboarding@resend.dev>',
			to: [homeData.contact_email],
			subject: `New message: ${subject || 'Portfolio Contact'}`,
			html: `<p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Message:</strong> ${message.replace(/\n/g, '<br>')}</p>
                 <hr><p>Count: ${currentCount}/5</p>`
		});

		if (error) throw error;

		return new Response(JSON.stringify({ success: true }));
	} catch (err: any) {
		console.error('Contact API error:', err);
		return new Response(JSON.stringify({ error: err.message || 'Server error' }), { status: 500 });
	}
};
