import { createServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

export function createSupabaseServerClient(event: RequestEvent) {
	const supabaseUrl = env.PUBLIC_SUPABASE_URL || '';
	const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY || env.PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

	return createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, {
						...options,
						path: '/'
					});
				});
			}
		}
	});
}
