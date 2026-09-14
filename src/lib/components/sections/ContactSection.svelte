<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SocialLinks } from '$lib/supabase/types';
	import { Mail, Send, CheckCircle2, AlertCircle, Github, Linkedin, Instagram, Twitter, Copy, Check } from 'lucide-svelte';

	interface Props {
		contactEmail?: string | null;
		socialLinks?: SocialLinks | null;
		form?: {
			contactSuccess?: boolean;
			contactMessage?: string;
			contactError?: string;
		} | null;
	}

	let { contactEmail = 'yusril.maqoshidana@gmail.com', socialLinks = null, form = null }: Props = $props();

	let emailToUse = $derived(contactEmail || 'yusril.maqoshidana@gmail.com');

	let isSubmitting = $state(false);
	let copied = $state(false);

	let nameInput = $state('');
	let emailInput = $state('');
	let subjectInput = $state('');
	let messageInput = $state('');

	function copyEmail() {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(emailToUse);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}

	function handleDirectEmail() {
		const mailtoUrl = `mailto:${emailToUse}?subject=${encodeURIComponent(subjectInput || 'Portfolio Inquiry')}&body=${encodeURIComponent(
			`Halo Yusril,\n\n${messageInput}\n\nDari: ${nameInput} (${emailInput})`
		)}`;
		window.open(mailtoUrl, '_blank');
	}
</script>

<section id="contact" class="py-20 px-6 max-w-6xl mx-auto border-t border-white/10">
	<div class="mb-12 text-center space-y-3">
		<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-code-keyword/10 border border-code-keyword/20 text-code-keyword text-xs font-semibold">
			<Mail class="w-3.5 h-3.5" />
			<span>05. _contact</span>
		</div>
		<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
			Get In <span class="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">Touch</span>
		</h2>
		<p class="text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
			Have a project in mind, job opportunity, or just want to say hi? Send me a message and I'll get back to you as soon as possible.
		</p>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
		<!-- Left Column: Info & Direct Email -->
		<div class="lg:col-span-5 space-y-6">
			<div class="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6">
				<h3 class="text-xl font-bold text-white">Contact Information</h3>
				<p class="text-sm text-gray-400 leading-relaxed">
					Feel free to reach out directly via email or connect with me through social platforms.
				</p>

				<!-- Direct Email Card -->
				<div class="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
					<div class="text-xs font-medium text-primary uppercase tracking-wider">Official Email</div>
					<div class="flex items-center justify-between gap-2">
						<a
							href="mailto:{emailToUse}"
							class="text-sm md:text-base font-semibold text-white hover:text-primary transition-colors truncate"
						>
							{emailToUse}
						</a>

						<button
							type="button"
							onclick={copyEmail}
							class="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors flex-shrink-0"
							title="Copy email"
						>
							{#if copied}
								<Check class="w-4 h-4 text-emerald-400" />
							{:else}
								<Copy class="w-4 h-4" />
							{/if}
						</button>
					</div>
				</div>

				<!-- Social Links -->
				{#if socialLinks}
					<div class="space-y-3 pt-4 border-t border-white/10">
						<div class="text-xs font-medium text-gray-400">Follow & Connect</div>
						<div class="flex items-center gap-3">
							{#if socialLinks.github}
								<a
									href={socialLinks.github}
									target="_blank"
									rel="noopener noreferrer"
									class="p-3 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
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
									class="p-3 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
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
									class="p-3 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
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
									class="p-3 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
									aria-label="Twitter"
								>
									<Twitter class="w-5 h-5" />
								</a>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Status Badge -->
				<div class="flex items-center gap-3 pt-4 border-t border-white/10 text-xs text-gray-400">
					<span class="relative flex h-2.5 w-2.5">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
					</span>
					<span>Active response • Usually replies within 24 hours</span>
				</div>
			</div>
		</div>

		<!-- Right Column: Interactive Form -->
		<div class="lg:col-span-7">
			<div class="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/5 space-y-6">
				<div>
					<h3 class="text-xl font-bold text-white">Send a Message</h3>
					<p class="text-xs md:text-sm text-gray-400 mt-1">Your message will be sent directly to my inbox and saved for review.</p>
				</div>

				{#if form?.contactSuccess}
					<div class="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm flex items-center gap-3">
						<CheckCircle2 class="w-5 h-5 flex-shrink-0" />
						<span>{form.contactMessage || 'Pesan Anda telah berhasil dikirim!'}</span>
					</div>
				{/if}

				{#if form?.contactError}
					<div class="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm flex items-center gap-3">
						<AlertCircle class="w-5 h-5 flex-shrink-0" />
						<span>{form.contactError}</span>
					</div>
				{/if}

				<form
					method="POST"
					action="?/sendContact"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
							if (form?.contactSuccess) {
								nameInput = '';
								emailInput = '';
								subjectInput = '';
								messageInput = '';
							}
						};
					}}
					class="space-y-4 text-sm"
				>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="space-y-1.5">
							<label for="contact_name" class="text-xs font-medium text-gray-300">Name <span class="text-primary">*</span></label>
							<input
								id="contact_name"
								type="text"
								name="name"
								bind:value={nameInput}
								required
								placeholder="Your Name"
								class="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
							/>
						</div>

						<div class="space-y-1.5">
							<label for="contact_email_input" class="text-xs font-medium text-gray-300">Email Address <span class="text-primary">*</span></label>
							<input
								id="contact_email_input"
								type="email"
								name="email"
								bind:value={emailInput}
								required
								placeholder="your.email@example.com"
								class="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
							/>
						</div>
					</div>

					<div class="space-y-1.5">
						<label for="contact_subject" class="text-xs font-medium text-gray-300">Subject</label>
						<input
							id="contact_subject"
							type="text"
							name="subject"
							bind:value={subjectInput}
							placeholder="Project Inquiry / Job Opportunity"
							class="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
						/>
					</div>

					<div class="space-y-1.5">
						<label for="contact_message" class="text-xs font-medium text-gray-300">Message <span class="text-primary">*</span></label>
						<textarea
							id="contact_message"
							name="message"
							bind:value={messageInput}
							rows="4"
							required
							placeholder="Write your message here..."
							class="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors resize-y"
						></textarea>
					</div>

					<div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
						<button
							type="button"
							onclick={handleDirectEmail}
							class="text-xs text-gray-400 hover:text-white underline flex items-center gap-1.5"
						>
							<Mail class="w-3.5 h-3.5" />
							<span>Open in Email App instead</span>
						</button>

						<button
							type="submit"
							disabled={isSubmitting}
							class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
						>
							{#if isSubmitting}
								<span>Sending...</span>
							{:else}
								<Send class="w-4 h-4" />
								<span>Send Message</span>
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</section>
