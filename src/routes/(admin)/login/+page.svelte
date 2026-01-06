<script lang="ts">
	import { Mail, Lock, LogIn, CircleAlert } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import Footer from '$lib/components/layout/Footer.svelte';

	let { form } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Admin Login | Portfolio</title>
</svelte:head>

<div class="relative flex min-h-screen items-center justify-center bg-background-dark p-4">
	<!-- Background Grid Pattern -->
	<div
		class="pointer-events-none absolute inset-0 bg-grid-pattern bg-size-[50px_50px] opacity-20"
	></div>

	<!-- Glow Effect -->
	<div
		class="pointer-events-none absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
	></div>

	<div class="relative z-10 w-full max-w-md">
		<!-- Logo -->
		<div class="mb-8 text-center">
			<a href="/" class="group inline-flex items-center gap-1 text-3xl font-bold tracking-tighter">
				<span class="text-primary transition-colors group-hover:text-white">&lt;</span>
				<span class="text-white">Admin</span>
				<span class="text-primary transition-colors group-hover:text-white">/&gt;</span>
			</a>
			<p class="mt-2 text-sm text-gray-400">Sign in to manage your portfolio</p>
		</div>

		<!-- Login Card -->
		<div class="glass-card rounded-2xl border border-border-dim/50 p-8 shadow-2xl">
			<h1 class="mb-6 text-center font-display text-2xl font-bold text-white">Welcome Back</h1>

			<!-- Error Message -->
			{#if form?.error}
				<div
					class="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400"
				>
					<CircleAlert class="h-5 w-5 shrink-0" />
					<p class="text-sm">{form.error}</p>
				</div>
			{/if}

			<form
				method="POST"
				action="?/login"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
				class="space-y-5"
			>
				<!-- Email Input -->
				<div class="space-y-2">
					<label for="email" class="block text-sm font-medium text-gray-300">Email</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
							<Mail class="h-5 w-5 text-gray-500" />
						</div>
						<input
							type="email"
							id="email"
							name="email"
							value={form?.email ?? ''}
							placeholder="admin@example.com"
							required
							class="w-full rounded-lg border border-border-dim bg-card-bg py-3 pr-4 pl-12 font-mono text-sm text-white placeholder-gray-500 transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
						/>
					</div>
				</div>

				<!-- Password Input -->
				<div class="space-y-2">
					<label for="password" class="block text-sm font-medium text-gray-300">Password</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
							<Lock class="h-5 w-5 text-gray-500" />
						</div>
						<input
							type="password"
							id="password"
							name="password"
							placeholder="••••••••"
							required
							class="w-full rounded-lg border border-border-dim bg-card-bg py-3 pr-4 pl-12 font-mono text-sm text-white placeholder-gray-500 transition-all focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
						/>
					</div>
				</div>

				<!-- Remember & Forgot -->
				<div class="flex items-center justify-between text-sm">
					<label class="flex cursor-pointer items-center gap-2">
						<input
							type="checkbox"
							class="h-4 w-4 rounded border-border-dim bg-card-bg text-primary focus:ring-primary focus:ring-offset-0"
						/>
						<span class="text-gray-400">Remember me</span>
					</label>
					<a href="#forgot" class="text-primary transition-colors hover:text-primary/80">
						Forgot password?
					</a>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={loading}
					class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-primary/40 disabled:cursor-not-allowed disabled:bg-primary/50"
				>
					{#if loading}
						<div
							class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
						></div>
						<span>Signing in...</span>
					{:else}
						<LogIn class="h-5 w-5" />
						<span>Sign In</span>
					{/if}
				</button>
			</form>

			<!-- Divider -->
			<div class="relative my-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-border-dim"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-card-bg px-4 text-gray-500">or</span>
				</div>
			</div>

			<!-- Back to Home -->
			<a
				href="/"
				class="block w-full rounded-lg border border-border-dim px-4 py-3 text-center text-gray-400 transition-all duration-200 hover:border-gray-500 hover:text-white"
			>
				← Back to Portfolio
			</a>
		</div>

		<!-- Footer -->
		<p class="mt-6 text-center text-xs text-gray-600">
			<span class="text-code-comment">// Protected area</span>
		</p>
		<Footer />
	</div>
</div>
