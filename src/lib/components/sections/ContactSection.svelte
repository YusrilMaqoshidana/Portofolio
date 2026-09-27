<script lang="ts">
	import type { SocialLinks } from '$lib/supabase/types';
	import { Mail, Github, Linkedin, Instagram, Twitter, Copy, Check, ExternalLink } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		contactEmail?: string | null;
		socialLinks?: SocialLinks | null;
	}

	let { contactEmail = 'yusrilmaqoshidana.work@gmail.com', socialLinks = null }: Props = $props();

	let emailToUse = $derived(contactEmail || 'yusrilmaqoshidana.work@gmail.com');
	let gmailUrl = $derived(
		`https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&su=Portfolio+Inquiry&to=${encodeURIComponent(emailToUse)}`
	);
	let copied = $state(false);

	function copyEmail() {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(emailToUse);
			copied = true;
			setTimeout(() => { copied = false; }, 2000);
		}
	}
</script>

<section id="contact" class="py-24 px-6 max-w-4xl mx-auto border-t border-white/5 scroll-mt-24">
	<div class="mb-14 text-center" use:reveal>
		<p class="font-mono text-xs text-gray-500 mb-3 tracking-widest uppercase">// 05. connect</p>
		<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
			Get In <span class="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Touch</span>
		</h2>
		<p class="mt-3 text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
			Have a project in mind, job opportunity, or just want to say hi? Feel free to reach out directly via email or connect on social media.
		</p>
	</div>

	<div class="max-w-2xl mx-auto" use:reveal={{ delay: 100 }}>
		<div class="relative glass-gradient-border noise overflow-hidden rounded-3xl bg-white/[0.03] p-8 md:p-10 space-y-8 text-center">

			<!-- Email box -->
			<div class="relative rounded-2xl bg-blue-500/5 border border-blue-500/15 p-6 space-y-4">
				<div class="font-mono text-[10px] text-blue-400/70 uppercase tracking-widest">official_email</div>
				<div class="flex items-center justify-center gap-3 flex-wrap">
					<a
						href={gmailUrl}
						target="_blank" rel="noopener noreferrer"
						class="text-base md:text-lg font-bold text-white hover:text-blue-300 transition-colors font-mono truncate"
					>
						{emailToUse}
					</a>
					<button
						type="button"
						onclick={copyEmail}
						class="p-2 rounded-lg glass border-white/8 text-gray-400 hover:text-white hover:border-white/20
							transition-all duration-200 shrink-0"
						title="Copy email"
						aria-label="Copy email address"
					>
						{#if copied}
							<Check class="w-4 h-4 text-teal-400" />
						{:else}
							<Copy class="w-4 h-4" />
						{/if}
					</button>
				</div>
				{#if copied}
					<p class="font-mono text-xs text-teal-400">// copied to clipboard</p>
				{/if}
			</div>

			<!-- CTA button -->
			<div>
				<a
					href={gmailUrl}
					target="_blank" rel="noopener noreferrer"
					class="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl
						bg-blue-500 text-white font-semibold text-sm
						hover:bg-blue-400 transition-all duration-200
						shadow-[0_0_24px_rgba(59,130,246,0.3)]
						hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]"
				>
					<Mail class="w-4 h-4" />
					Send Email Directly
					<ExternalLink class="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
				</a>
			</div>

			<!-- Social links -->
			{#if socialLinks}
				<div class="space-y-4 pt-4 border-t border-white/8">
					<div class="font-mono text-[10px] text-gray-500 uppercase tracking-widest">follow_and_connect</div>
					<div class="flex items-center justify-center gap-3 flex-wrap">
						{#if socialLinks.github}
							<a href={socialLinks.github} target="_blank" rel="noopener noreferrer"
								class="p-3 rounded-xl glass border-white/8 text-gray-400 hover:text-white hover:border-white/20
									transition-all duration-200 hover:shadow-[0_0_12px_rgba(255,255,255,0.1)]"
								aria-label="GitHub">
								<Github class="w-5 h-5" />
							</a>
						{/if}
						{#if socialLinks.linkedin}
							<a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
								class="p-3 rounded-xl glass border-white/8 text-gray-400 hover:text-blue-400 hover:border-blue-400/30
									transition-all duration-200 hover:shadow-[0_0_12px_rgba(59,130,246,0.2)]"
								aria-label="LinkedIn">
								<Linkedin class="w-5 h-5" />
							</a>
						{/if}
						{#if socialLinks.instagram}
							<a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
								class="p-3 rounded-xl glass border-white/8 text-gray-400 hover:text-violet-400 hover:border-violet-400/30
									transition-all duration-200 hover:shadow-[0_0_12px_rgba(139,92,246,0.2)]"
								aria-label="Instagram">
								<Instagram class="w-5 h-5" />
							</a>
						{/if}
						{#if socialLinks.twitter}
							<a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
								class="p-3 rounded-xl glass border-white/8 text-gray-400 hover:text-blue-300 hover:border-blue-300/30
									transition-all duration-200 hover:shadow-[0_0_12px_rgba(147,197,253,0.2)]"
								aria-label="Twitter">
								<Twitter class="w-5 h-5" />
							</a>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Status -->
			<div class="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono">
				<span class="relative flex h-2 w-2">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
				</span>
				active_response · usually_replies_within_24h
			</div>
		</div>
	</div>
</section>
