import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const session = await locals.getSession();

	console.log('🔐 Auth Check:', {
		path: url.pathname,
		hasSession: !!session,
		user: session?.user?.email
	});

	if (url.pathname === '/login') {
		if (session) {
			console.log('✅ Already logged in, redirecting to /admin');
			throw redirect(303, '/admin');
		}
		return { session };
	}

	if (!session) {
		console.log('❌ No session, redirecting to /login');
		throw redirect(303, '/login');
	}

	console.log('✅ Session valid, allowing access to:', url.pathname);
	return { session };
};
