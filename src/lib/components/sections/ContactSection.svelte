<script lang="ts">
	import type { SocialLinks } from '$lib/supabase/types';
	import { Mail, Github, Linkedin, Instagram, Twitter, ExternalLink, Loader2, Send } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		socialLinks?: SocialLinks | null;
	}

	let { socialLinks = null }: Props = $props();

	let formState = $state({ name: '', email: '', subject: '', message: '' });
	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let errorMessage = $state('');

	async function handleSubmit() {
		status = 'loading';
		errorMessage = '';

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formState)
			});

			const result = await res.json();
			if (!res.ok) throw new Error(result.error || 'Failed to send');

			status = 'success';
			formState = { name: '', email: '', subject: '', message: '' };
		} catch (e: any) {
			status = 'error';
			errorMessage = e.message;
		}
	}
</script>

<section id="contact" class="py-24 px-6 max-w-4xl mx-auto border-t border-white/5 scroll-mt-24">
	<div class="mb-14 text-center" use:reveal>
		<p class="font-mono text-xs text-gray-500 mb-3 tracking-widest uppercase">// 05. contact</p>
		<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
			Collaborate & <span class="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Reach Out</span>
		</h2>
		<p class="mt-3 text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
			Interested in collaboration or career opportunities? Fill out the form below.
		</p>
	</div>

	<div class="max-w-2xl mx-auto" use:reveal={{ delay: 100 }}>
		<form
			onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}
			class="relative glass-gradient-border noise overflow-hidden rounded-3xl bg-white/[0.03] p-8 md:p-10 space-y-6"
		>
			<div class="grid md:grid-cols-2 gap-6">
				<div class="space-y-1.5">
					<label for="name" class="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Name</label>
					<input required bind:value={formState.name} id="name" type="text" class="w-full bg-white/5 rounded-xl border border-white/10 px-4 py-3 text-white text-sm focus:border-blue-500 transition-all outline-none" />
				</div>
				<div class="space-y-1.5">
					<label for="email" class="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Email</label>
					<input required bind:value={formState.email} id="email" type="email" class="w-full bg-white/5 rounded-xl border border-white/10 px-4 py-3 text-white text-sm focus:border-blue-500 transition-all outline-none" />
				</div>
			</div>
			<div class="space-y-1.5">
				<label for="subject" class="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Subject</label>
				<input bind:value={formState.subject} id="subject" type="text" class="w-full bg-white/5 rounded-xl border border-white/10 px-4 py-3 text-white text-sm focus:border-blue-500 transition-all outline-none" />
			</div>
			<div class="space-y-1.5">
				<label for="message" class="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Message</label>
				<textarea
					required
					bind:value={formState.message}
					id="message"
					rows="4"
					class="w-full bg-white/5 rounded-xl border border-white/10 px-4 py-3 text-white text-sm focus:border-blue-500 transition-all outline-none"
				></textarea>
			</div>

			<button
				disabled={status === 'loading'}
				class="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl
					bg-blue-500 text-white font-semibold text-sm
					hover:bg-blue-400 transition-all duration-200
					disabled:opacity-50 disabled:cursor-not-allowed
					shadow-[0_0_24px_rgba(59,130,246,0.3)]"
			>
				{#if status === 'loading'}
					<Loader2 class="w-4 h-4 animate-spin" /> Sending...
				{:else}
					<Send class="w-4 h-4" /> Send Message
				{/if}
			</button>

			{#if status === 'success'}
				<p class="text-center text-sm text-teal-400 font-mono italic">Message sent successfully!</p>
			{:else if status === 'error'}
				<p class="text-center text-sm text-red-400 font-mono italic">{errorMessage}</p>
			{/if}
		</form>

		{#if socialLinks}
			<div class="flex items-center justify-center gap-3 mt-8">
				{#if socialLinks.github}
					<a href={socialLinks.github} target="_blank" rel="noopener noreferrer"
						class="p-3 rounded-xl glass border-white/8 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200"
						aria-label="GitHub"><Github class="w-5 h-5" /></a>
				{/if}
				{#if socialLinks.linkedin}
					<a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
						class="p-3 rounded-xl glass border-white/8 text-gray-400 hover:text-blue-400 hover:border-blue-400/30 transition-all duration-200"
						aria-label="LinkedIn"><Linkedin class="w-5 h-5" /></a>
				{/if}
			</div>
		{/if}
	</div>
</section>
