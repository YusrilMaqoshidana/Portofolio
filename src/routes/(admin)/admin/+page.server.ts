import { logout } from '$lib/supabase/auth.server';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const actions = {
	logout: async (
		event: RequestEvent<
			Record<string, never>,
			'/(admin)' | '/' | '/(admin)/admin' | '/(admin)/login' | null
		>
	) => {
		const result = await logout(event);
		if (!result.success) {
			return { error: result.error || 'Logout failed' };
		}
		// Redirect to homepage after successful logout
		throw redirect(303, '/');
	}
};
