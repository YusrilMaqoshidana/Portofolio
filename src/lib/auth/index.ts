// Auth Store exports
export { authStore, user, session, isAuthenticated, isLoading, initializeAuth } from './authStore';

// Auth Helpers exports
export {
	signIn,
	signOut,
	getSession,
	getUser,
	updateUserMetadata
} from './authHelpers';

export type { LoginCredentials, AuthResult } from './authHelpers';

// Guards exports
export {
	requireAuth,
	requireGuest,
	requireRole,
} from './guards';
