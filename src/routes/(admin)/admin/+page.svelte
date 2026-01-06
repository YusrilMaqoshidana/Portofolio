<script lang="ts">
	import { enhance } from '$app/forms';
	import { LayoutDashboard, FileText, Briefcase, Settings, LogOut, User } from 'lucide-svelte';

	let { data } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Admin Dashboard | Portfolio</title>
</svelte:head>

<div class="flex min-h-screen bg-background-dark">
	<!-- Sidebar -->
	<aside class="fixed top-0 left-0 z-40 h-screen w-64 border-r border-border-dim bg-card-bg">
		<!-- Logo -->
		<div class="flex h-16 items-center border-b border-border-dim px-6">
			<a href="/admin" class="group flex items-center gap-1 text-xl font-bold tracking-tighter">
				<span class="text-primary transition-colors group-hover:text-white">&lt;</span>
				<span class="text-white">Admin</span>
				<span class="text-primary transition-colors group-hover:text-white">/&gt;</span>
			</a>
		</div>

		<!-- Navigation -->
		<nav class="space-y-1 p-4">
			<a
				href="/admin"
				class="flex items-center gap-3 rounded-lg bg-primary/10 px-4 py-3 text-primary transition-colors"
			>
				<LayoutDashboard class="h-5 w-5" />
				<span class="font-medium">Dashboard</span>
			</a>
			<a
				href="/admin/projects"
				class="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
			>
				<Briefcase class="h-5 w-5" />
				<span>Projects</span>
			</a>
			<a
				href="/admin/posts"
				class="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
			>
				<FileText class="h-5 w-5" />
				<span>Blog Posts</span>
			</a>
			<a
				href="/admin/settings"
				class="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
			>
				<Settings class="h-5 w-5" />
				<span>Settings</span>
			</a>
		</nav>

		<!-- User Section -->
		<div class="absolute right-0 bottom-0 left-0 border-t border-border-dim p-4">
			<div class="mb-3 flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
					<User class="h-4 w-4 text-primary" />
				</div>
				<div class="flex-1 overflow-hidden">
					<p class="truncate text-sm font-medium text-white">
						{data.session?.user?.email ?? 'Admin'}
					</p>
					<p class="text-xs text-gray-500">Administrator</p>
				</div>
			</div>
			<form
				method="POST"
				action="?/logout"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
			>
				<button
					type="submit"
					disabled={loading}
					class="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
				>
					<LogOut class="h-4 w-4" />
					<span class="text-sm">{loading ? 'Logging out...' : 'Logout'}</span>
				</button>
			</form>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="ml-64 flex-1 p-8">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="font-display text-3xl font-bold text-white">Dashboard</h1>
			<p class="mt-1 text-gray-400">Welcome back! Here's an overview of your portfolio.</p>
		</div>

		<!-- Stats Cards -->
		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-xl border border-border-dim bg-card-bg p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-400">Total Projects</p>
						<p class="mt-1 text-3xl font-bold text-white">12</p>
					</div>
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Briefcase class="h-6 w-6 text-primary" />
					</div>
				</div>
				<p class="mt-3 text-xs text-code-string">+2 this month</p>
			</div>

			<div class="rounded-xl border border-border-dim bg-card-bg p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-400">Blog Posts</p>
						<p class="mt-1 text-3xl font-bold text-white">8</p>
					</div>
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-code-string/10">
						<FileText class="h-6 w-6 text-code-string" />
					</div>
				</div>
				<p class="mt-3 text-xs text-code-string">+1 this week</p>
			</div>

			<div class="rounded-xl border border-border-dim bg-card-bg p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-400">Page Views</p>
						<p class="mt-1 text-3xl font-bold text-white">1.2K</p>
					</div>
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-code-func/10">
						<LayoutDashboard class="h-6 w-6 text-code-func" />
					</div>
				</div>
				<p class="mt-3 text-xs text-code-func">+15% vs last month</p>
			</div>

			<div class="rounded-xl border border-border-dim bg-card-bg p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-400">Messages</p>
						<p class="mt-1 text-3xl font-bold text-white">5</p>
					</div>
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-code-keyword/10">
						<User class="h-6 w-6 text-code-keyword" />
					</div>
				</div>
				<p class="mt-3 text-xs text-code-keyword">3 unread</p>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="rounded-xl border border-border-dim bg-card-bg p-6">
			<h2 class="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
			<div class="flex flex-wrap gap-3">
				<a
					href="/admin/projects/new"
					class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
				>
					+ New Project
				</a>
				<a
					href="/admin/posts/new"
					class="rounded-lg border border-border-dim px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5"
				>
					+ New Post
				</a>
				<a
					href="/"
					target="_blank"
					class="rounded-lg border border-border-dim px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5"
				>
					View Portfolio →
				</a>
			</div>
		</div>
	</main>
</div>
