import type { RequestEvent } from '@sveltejs/kit';
import type { User, Session } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

export interface LoginResult {
	success: boolean;
	user?: User;
	session?: Session;
	error?: string;
}

export interface SignUpResult {
	success: boolean;
	user?: User;
	session?: Session;
	error?: string;
}

export async function login(
	event: RequestEvent,
	email: string,
	password: string
): Promise<LoginResult> {
	try {
		const supabase = event.locals.supabase;

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			console.error('Login error:', error);
			return {
				success: false,
				error: error.message || 'Login failed'
			};
		}

		if (!data.user || !data.session) {
			return {
				success: false,
				error: 'No user data returned'
			};
		}

		// Refresh session to ensure cookies are properly set
		const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

		if (refreshError) {
			console.warn('Session refresh warning:', refreshError);
		}

		return {
			success: true,
			user: data.user,
			session: refreshData?.session || data.session
		};
	} catch (error) {
		console.error('Unexpected login error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Login failed'
		};
	}
}

/**
 * Server-side logout function
 */
export async function logout(event: RequestEvent): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = event.locals.supabase;

		const { error } = await supabase.auth.signOut();

		if (error && error.message !== 'Auth session missing!') {
			console.error('Logout error:', error);
			return {
				success: false,
				error: error.message || 'Logout failed'
			};
		}

		return { success: true };
	} catch (error) {
		console.error('Unexpected logout error:', error);

		if (error instanceof Error && error.message === 'Auth session missing!') {
			return { success: true };
		}

		const supabaseUrl = env.PUBLIC_SUPABASE_URL || '';
		const projectRef = supabaseUrl ? supabaseUrl.split('//')[1]?.split('.')[0] : '';

		if (projectRef) {
			const cookiesToDelete = [
				'sb-access-token',
				'sb-refresh-token',
				`sb-${projectRef}-auth-token`,
				`sb-${projectRef}-auth-token.0`,
				`sb-${projectRef}-auth-token.1`
			];

			cookiesToDelete.forEach((cookieName) => {
				event.cookies.delete(cookieName, { path: '/' });
			});
		}

		return {
			success: false,
			error: error instanceof Error ? error.message : 'Logout failed'
		};
	}
}

/**
 * Get current session from server
 */
export async function getSession(event: RequestEvent) {
	const supabase = event.locals.supabase;
	const {
		data: { session },
		error
	} = await supabase.auth.getSession();

	if (error) {
		console.error('Error getting session:', error);
		return null;
	}

	return session;
}

/**
 * Get current user from server
 */
export async function getUser(event: RequestEvent) {
	const supabase = event.locals.supabase;
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();

	if (error) {
		console.error('Error getting user:', error);
		return null;
	}

	return user;
}
