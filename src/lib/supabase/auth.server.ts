import type { RequestEvent } from '@sveltejs/kit';
import type { User, Session, AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

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

		// **Refresh session to ensure cookies are properly set**
		const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

		if (refreshError) {
			console.warn('Session refresh warning:', refreshError);
			// Don't fail login if refresh fails, session is still valid
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
		document.cookie = 'sb-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		document.cookie = 'sb-user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		const supabase = event.locals.supabase;

		const { error } = await supabase.auth.signOut();

		// Ignore "Auth session missing" error - user is already logged out
		if (error && error.message !== 'Auth session missing!') {
			console.error('Logout error:', error);
			return {
				success: false,
				error: error.message || 'Logout failed'
			};
		}

		// Consider it success even if session was already missing
		return { success: true };
	} catch (error) {
		console.error('Unexpected logout error:', error);

		// Check if it's the "Auth session missing" error
		if (error instanceof Error && error.message === 'Auth session missing!') {
			// User is already logged out, consider it success
			return { success: true };
		}

        // Hapus semua Supabase cookies secara manual
		const cookiesToDelete = [
			'sb-access-token',
			'sb-refresh-token',
			// Format baru Supabase v2
			`sb-${PUBLIC_SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`,
			`sb-${PUBLIC_SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token.0`,
			`sb-${PUBLIC_SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token.1`
		];

		cookiesToDelete.forEach(cookieName => {
			event.cookies.delete(cookieName, { path: '/' });
		});

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
