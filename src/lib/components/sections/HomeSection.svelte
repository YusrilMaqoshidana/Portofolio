<script lang="ts">
	import type { HomeSection as HomeData } from '$lib/supabase/types';
	import {
		Github,
		Linkedin,
		Instagram,
		Twitter,
		FileText,
		ArrowRight,
		MapPin,
		Mail
	} from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		data?: HomeData | null;
		loading?: boolean;
	}

	let { data = null, loading = false }: Props = $props();

	const home = $derived(
		data ?? {
			id: '',
			updated_at: '',
			full_name: 'Moh. Yusril Maqoshidana',
			tagline: 'Mobile & Android Developer | Flutter & Kotlin Enthusiast',
			bio: 'I am Information Technology student with 1 year of experience in Mobile Development. Experienced in building mobile applications using Flutter, Jetpack Compose, and XML. Proficient in implementing clean code with expertise in Kotlin and Dart programming languages. Enthusiastic about Android development and mobile architectures.',
			avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
			resume_url: '/cv',
			location: 'Jember, East Java',
			whatsapp_url: 'https://wa.link/jlntd2',
			contact_email: 'yusrilmaqoshidana.work@gmail.com',
			social_links: {
				github: 'https://github.com/YusrilMaqoshidana',
				linkedin: 'http://www.linkedin.com/in/moh-yusril-maqoshidana-ti222410102064',
				whatsapp: 'https://wa.link/jlntd2'
			}
		}
	);
</script>

<section id="home" class="relative min-h-[92vh] flex items-center justify-center py-24 px-6 max-w-6xl mx-auto scroll-mt-24">
	{#if loading}
		<div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center animate-pulse">
			<div class="lg:col-span-7 space-y-6">
				<div class="h-6 w-48 bg-white/8 rounded-full"></div>
				<div class="h-14 w-3/4 bg-white/8 rounded-xl"></div>
				<div class="h-6 w-1/2 bg-white/8 rounded-lg"></div>
				<div class="h-20 w-full bg-white/8 rounded-xl"></div>
				<div class="flex gap-4 pt-4">
					<div class="h-12 w-36 bg-white/8 rounded-xl"></div>
					<div class="h-12 w-36 bg-white/8 rounded-xl"></div>
				</div>
			</div>
			<div class="lg:col-span-5 flex justify-center">
				<div class="w-72 h-72 rounded-full bg-white/8"></div>
			</div>
		</div>
	{:else}
		<div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
			<!-- Text Content -->
			<div class="lg:col-span-7 space-y-7">
				<!-- Heading & Location Tag -->
				<div use:reveal={{ delay: 80 }} class="space-y-3">
					<div class="flex flex-wrap items-center gap-2">
						<p class="font-mono text-xs text-gray-500 tracking-widest uppercase">// 01. introduction</p>
						{#if home.location}
							<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[11px]">
								<MapPin class="w-3 h-3" />
								{home.location}
							</span>
						{/if}
					</div>

					<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
						Hi, I'm<br />
						<span class="bg-gradient-to-r from-blue-400 via-teal-400 to-blue-300 bg-clip-text text-transparent">
							{home.full_name}
						</span>
					</h1>
				</div>

				<!-- Tagline -->
				<div use:reveal={{ delay: 160 }}>
					<p class="text-lg md:text-xl font-medium text-gray-300 font-mono">
						<span class="text-blue-400/60">&gt;</span> {home.tagline}
					</p>
				</div>

				<!-- Bio -->
				<div use:reveal={{ delay: 240 }}>
					<p class="text-gray-400 leading-relaxed max-w-xl text-base md:text-lg">
						{home.bio}
					</p>
				</div>

				<!-- Quick Contact Badges -->
				<div use:reveal={{ delay: 280 }} class="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
					{#if home.contact_email}
						<a
							href="mailto:{home.contact_email}"
							class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/8 hover:text-white hover:border-blue-500/40 transition-colors"
						>
							<Mail class="w-3.5 h-3.5 text-blue-400" />
							<span>{home.contact_email}</span>
						</a>
					{/if}
				</div>

				<!-- CTAs + socials -->
				<div use:reveal={{ delay: 320 }} class="flex flex-wrap items-center gap-4 pt-2">
					<a
						href="#projects"
						class="inline-flex items-center gap-2 px-6 py-3 rounded-xl
							bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm
							transition-all duration-200 shadow-[0_0_24px_rgba(59,130,246,0.35)]"
					>
						Explore Projects
						<ArrowRight class="w-4 h-4" />
					</a>

					<!-- Social icons -->
					<div class="flex items-center gap-2 pl-3 border-l border-white/10">
						{#if home.social_links?.github}
							<a
								href={home.social_links.github}
								target="_blank" rel="noopener noreferrer"
								aria-label="GitHub"
								class="p-2.5 rounded-xl glass border-white/8 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200"
							><Github class="w-4 h-4" /></a>
						{/if}
						{#if home.social_links?.linkedin}
							<a
								href={home.social_links.linkedin}
								target="_blank" rel="noopener noreferrer"
								aria-label="LinkedIn"
								class="p-2.5 rounded-xl glass border-white/8 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200"
							><Linkedin class="w-4 h-4" /></a>
						{/if}
						{#if home.social_links?.instagram}
							<a
								href={home.social_links.instagram}
								target="_blank" rel="noopener noreferrer"
								aria-label="Instagram"
								class="p-2.5 rounded-xl glass border-white/8 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200"
							><Instagram class="w-4 h-4" /></a>
						{/if}
						{#if home.social_links?.twitter}
							<a
								href={home.social_links.twitter}
								target="_blank" rel="noopener noreferrer"
								aria-label="Twitter"
								class="p-2.5 rounded-xl glass border-white/8 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200"
							><Twitter class="w-4 h-4" /></a>
						{/if}
					</div>
				</div>
			</div>

			<!-- Avatar -->
			<div class="lg:col-span-5 flex justify-center" use:reveal={{ delay: 200 }}>
				<div class="relative group animate-float">
					<!-- Outer glow ring -->
					<div class="absolute -inset-3 rounded-full bg-gradient-to-br from-blue-500/30 via-teal-400/20 to-violet-500/20 blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 animate-glow-pulse"></div>

					<!-- Image container -->
					<div class="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full overflow-hidden p-1 bg-gradient-to-br from-blue-500/60 via-teal-400/40 to-transparent shadow-[0_0_60px_rgba(59,130,246,0.3)]">
						<div class="w-full h-full rounded-full overflow-hidden bg-background-card">
							<img
								src={home.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
								alt={home.full_name}
								class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
							/>
						</div>
					</div>

					<!-- Floating badge -->
					<div class="absolute -bottom-2 -left-4 px-4 py-2 rounded-2xl glass-gradient-border noise bg-black/60 backdrop-blur-md shadow-xl flex items-center gap-2">
						<span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
						<span class="font-mono text-xs text-white">Available for Work</span>
					</div>
				</div>
			</div>
		</div>
	{/if}
</section>
