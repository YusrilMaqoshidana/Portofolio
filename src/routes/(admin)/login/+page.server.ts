import { login } from '$lib/supabase/auth.server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		// Validation
		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		if (!email.includes('@')) {
			return fail(400, { error: 'Invalid email format', email });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters', email });
		}

		// Attempt login
		const result = await login(event, email, password);

		if (!result.success) {
			return fail(401, { error: result.error || 'Login failed', email });
		}

		// **IMPORTANT: Refresh session to ensure cookies are set**
		await event.locals.supabase.auth.refreshSession();

		// Redirect to admin dashboard
		throw redirect(303, '/admin');
	}
};
