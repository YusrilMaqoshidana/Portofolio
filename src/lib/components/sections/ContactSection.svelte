<script lang="ts">
	import type { SocialLinks } from '$lib/supabase/types';
	import { Mail, Github, Linkedin, Instagram, Twitter, Copy, Check, ExternalLink } from 'lucide-svelte';

	interface Props {
		contactEmail?: string | null;
		socialLinks?: SocialLinks | null;
	}

	let { contactEmail = 'yusril.maqoshidana@gmail.com', socialLinks = null }: Props = $props();

	let emailToUse = $derived(contactEmail || 'yusril.maqoshidana@gmail.com');
	let copied = $state(false);

	function copyEmail() {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(emailToUse);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}
</script>

<section id="contact" class="py-20 px-6 max-w-4xl mx-auto border-t border-white/10 scroll-mt-24">
	<div class="mb-12 text-center space-y-3">
		<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-code-keyword/10 border border-code-keyword/20 text-code-keyword text-xs font-semibold">
			<Mail class="w-3.5 h-3.5" />
			<span>05. _contact</span>
		</div>
		<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
			Get In <span class="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">Touch</span>
		</h2>
		<p class="text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
			Have a project in mind, job opportunity, or just want to say hi? Feel free to reach out directly via email or connect on social media.
		</p>
	</div>

	<div class="p-8 md:p-10 rounded-2xl border border-white/10 bg-white/5 space-y-8 max-w-2xl mx-auto text-center">
		<!-- Direct Email Box -->
		<div class="p-6 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
			<div class="text-xs font-medium text-primary uppercase tracking-wider">Official Email</div>
			<div class="flex items-center justify-center gap-3">
				<a
					href="mailto:{emailToUse}"
					class="text-lg md:text-xl font-bold text-white hover:text-primary transition-colors truncate"
				>
					{emailToUse}
				</a>
				<button
					type="button"
					onclick={copyEmail}
					class="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors flex-shrink-0"
					title="Copy email"
				>
					{#if copied}
						<Check class="w-4 h-4 text-emerald-400" />
					{:else}
						<Copy class="w-4 h-4" />
					{/if}
				</button>
			</div>
			{#if copied}
				<p class="text-xs text-emerald-400 font-medium">Email address copied to clipboard!</p>
			{/if}
		</div>

		<!-- Action Button -->
		<div>
			<a
				href="mailto:{emailToUse}?subject=Portfolio%20Inquiry"
				class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm md:text-base"
			>
				<Mail class="w-5 h-5" />
				<span>Send Email Directly</span>
				<ExternalLink class="w-4 h-4 opacity-75" />
			</a>
		</div>

		<!-- Social Links -->
		{#if socialLinks}
			<div class="space-y-3 pt-6 border-t border-white/10">
				<div class="text-xs font-medium text-gray-400">Follow & Connect</div>
				<div class="flex items-center justify-center gap-4">
					{#if socialLinks.github}
						<a
							href={socialLinks.github}
							target="_blank"
							rel="noopener noreferrer"
							class="p-3.5 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
							aria-label="GitHub"
						>
							<Github class="w-5 h-5" />
						</a>
					{/if}

					{#if socialLinks.linkedin}
						<a
							href={socialLinks.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							class="p-3.5 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
							aria-label="LinkedIn"
						>
							<Linkedin class="w-5 h-5" />
						</a>
					{/if}

					{#if socialLinks.instagram}
						<a
							href={socialLinks.instagram}
							target="_blank"
							rel="noopener noreferrer"
							class="p-3.5 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
							aria-label="Instagram"
						>
							<Instagram class="w-5 h-5" />
						</a>
					{/if}

					{#if socialLinks.twitter}
						<a
							href={socialLinks.twitter}
							target="_blank"
							rel="noopener noreferrer"
							class="p-3.5 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
							aria-label="Twitter"
						>
							<Twitter class="w-5 h-5" />
						</a>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Status Badge -->
		<div class="flex items-center justify-center gap-3 text-xs text-gray-400">
			<span class="relative flex h-2.5 w-2.5">
				<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
				<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
			</span>
			<span>Active response • Usually replies within 24 hours</span>
		</div>
	</div>
</section>
