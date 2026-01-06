import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Server-side guard: Require authentication
 * Use in +layout.server.ts or +page.server.ts load functions
 */
export async function requireAuth(event: RequestEvent, redirectTo: string = '/login') {
	const session = await event.locals.getSession();

	if (!session) {
		throw redirect(303, redirectTo);
	}

	return session;
}

/**
 * Server-side guard: Require guest (not authenticated)
 * Use in login/signup pages
 */
export async function requireGuest(event: RequestEvent, redirectTo: string = '/admin') {
	const session = await event.locals.getSession();

	if (session) {
		throw redirect(303, redirectTo);
	}

	return null;
}

/**
 * Server-side guard: Require specific role
 */
export async function requireRole(
	event: RequestEvent,
	requiredRole: string,
	redirectTo: string = '/login'
) {
	const session = await event.locals.getSession();

	if (!session) {
		throw redirect(303, redirectTo);
	}

	const userRole = session.user?.user_metadata?.role;

	if (userRole !== requiredRole) {
		throw redirect(303, '/');
	}

	return session;
}
