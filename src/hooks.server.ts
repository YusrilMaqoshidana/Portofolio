import { createServerClient } from '@supabase/ssr';
import { type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

export const handle: Handle = async ({ event, resolve }) => {
	const supabaseUrl = env.PUBLIC_SUPABASE_URL || '';
	const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY || env.PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

	event.locals.supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, {
						...options,
						path: '/',
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						sameSite: 'lax'
					});
				});
			}
		}
	});

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version' || name === 'set-cookie';
		}
	});
};
