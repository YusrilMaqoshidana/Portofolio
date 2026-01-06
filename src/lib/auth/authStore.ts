import { writable, derived, type Readable } from 'svelte/store';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '$lib/supabase/client';

interface AuthState {
	user: User | null;
	session: Session | null;
	loading: boolean;
	error: AuthError | null;
}

const initialState: AuthState = {
	user: null,
	session: null,
	loading: true,
	error: null
};

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>(initialState);

	return {
		subscribe,
		setUser: (user: User | null) => update((state) => ({ ...state, user })),
		setSession: (session: Session | null) =>
			update((state) => ({ ...state, session, user: session?.user ?? null })),
		setLoading: (loading: boolean) => update((state) => ({ ...state, loading })),
		setError: (error: AuthError | null) => update((state) => ({ ...state, error })),
		reset: () => set(initialState)
	};
}

export const authStore = createAuthStore();

// Derived stores for easier access
export const user: Readable<User | null> = derived(authStore, ($auth) => $auth.user);
export const session: Readable<Session | null> = derived(authStore, ($auth) => $auth.session);
export const isAuthenticated: Readable<boolean> = derived(
	authStore,
	($auth) => !!$auth.session && !!$auth.user
);
export const isLoading: Readable<boolean> = derived(authStore, ($auth) => $auth.loading);

// Initialize auth state listener
export function initializeAuth() {
	// Get initial session
	supabase.auth.getSession().then(({ data: { session }, error }) => {
		if (error) {
			console.error('Error getting session:', error);
			authStore.setError(error);
		}
		authStore.setSession(session);
		authStore.setLoading(false);
	});

	// Listen for auth changes
	const {
		data: { subscription }
	} = supabase.auth.onAuthStateChange((_event, session) => {
		authStore.setSession(session);
		authStore.setLoading(false);
	});

	// Cleanup function
	return () => {
		subscription.unsubscribe();
	};
}
