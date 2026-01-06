import { supabase } from '$lib/supabase/client';
import { authStore } from './authStore';
import type { AuthError } from '@supabase/supabase-js';

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface AuthResult {
	loading?: boolean;
	success: boolean;
	error?: AuthError | Error;
}

/**
 * Sign in with email and password
 */
export async function signIn(credentials: LoginCredentials): Promise<AuthResult> {
	try {
		authStore.setLoading(true);
		authStore.setError(null);

		const { data, error } = await supabase.auth.signInWithPassword({
			email: credentials.email,
			password: credentials.password
		});

		if (error) {
			authStore.setError(error);
			return { success: false, error };
		}

		authStore.setSession(data.session);
		return { success: true };
	} catch (error) {
		const err = error as Error;
		authStore.setError(err as AuthError);
		return { success: false, error: err };
	} finally {
		authStore.setLoading(false);
	}
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<AuthResult> {
	try {
		authStore.setLoading(true);
		authStore.setError(null);

		const { error } = await supabase.auth.signOut();

		if (error) {
			authStore.setError(error);
			return { success: false, error };
		}

		authStore.reset();
		return { success: true };
	} catch (error) {
		const err = error as Error;
		authStore.setError(err as AuthError);
		return { success: false, error: err };
	} finally {
		authStore.setLoading(false);
	}
}

/**
 * Get current session
 */
export async function getSession() {
	const {
		data: { session },
		error
	} = await supabase.auth.getSession();

	if (error) {
		console.error('Error getting session:', error);
		authStore.setError(error);
		return null;
	}

	return session;
}

/**
 * Get current user
 */
export async function getUser() {
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();

	if (error) {
		console.error('Error getting user:', error);
		authStore.setError(error);
		return null;
	}

	return user;
}

/**
 * Update user metadata
 */
export async function updateUserMetadata(metadata: Record<string, any>): Promise<AuthResult> {
	try {
		authStore.setLoading(true);
		authStore.setError(null);

		const { data, error } = await supabase.auth.updateUser({
			data: metadata
		});

		if (error) {
			authStore.setError(error);
			return { success: false, error };
		}

		if (data.user) {
			authStore.setUser(data.user);
		}

		return { success: true };
	} catch (error) {
		const err = error as Error;
		authStore.setError(err as AuthError);
		return { success: false, error: err };
	} finally {
		authStore.setLoading(false);
	}
}
