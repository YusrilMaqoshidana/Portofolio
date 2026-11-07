<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		Home,
		Briefcase,
		Code2,
		GraduationCap,
		Trophy,
		Mail,
		LogOut,
		Plus,
		Trash2,
		Edit,
		Save,
		ExternalLink,
		User,
		CheckCircle2,
		AlertCircle,
		Eye,
		EyeOff,
		Clock,
		Send,
		FileText,
		MapPin,
		Phone,
		Lock,
		Check
	} from 'lucide-svelte';
	import type {
		ProjectSection,
		SkillSection,
		ExperienceSection,
		EducationSection,
		AchievementSection,
		ContactMessage
	} from '$lib/supabase/types';

	let { data, form } = $props();

	// Active tab: 'home' | 'education' | 'experience' | 'projects' | 'skills' | 'achievements' | 'contact'
	let activeTab = $state<'home' | 'education' | 'experience' | 'projects' | 'skills' | 'achievements' | 'contact'>('home');
	let loading = $state(false);

	// Edit states
	let editingProject = $state<ProjectSection | null>(null);
	let editingSkill = $state<SkillSection | null>(null);
	let editingExperience = $state<ExperienceSection | null>(null);
	let editingEducation = $state<EducationSection | null>(null);
	let editingAchievement = $state<AchievementSection | null>(null);
	let selectedMessage = $state<ContactMessage | null>(null);

	// Modal show states
	let showProjectModal = $state(false);
	let showSkillModal = $state(false);
	let showExperienceModal = $state(false);
	let showEducationModal = $state(false);
	let showAchievementModal = $state(false);
	let showMessageModal = $state(false);

	function openProjectModal(project?: ProjectSection) {
		editingProject = project || null;
		showProjectModal = true;
	}

	function openSkillModal(skill?: SkillSection) {
		editingSkill = skill || null;
		showSkillModal = true;
	}

	function openExperienceModal(exp?: ExperienceSection) {
		editingExperience = exp || null;
		showExperienceModal = true;
	}

	function openEducationModal(edu?: EducationSection) {
		editingEducation = edu || null;
		showEducationModal = true;
	}

	function openAchievementModal(ach?: AchievementSection) {
		editingAchievement = ach || null;
		showAchievementModal = true;
	}

	function openMessageModal(msg: ContactMessage) {
		selectedMessage = msg;
		showMessageModal = true;
	}

	const unreadCount = $derived(
		(data.contactMessages || []).filter((m: ContactMessage) => !m.is_read).length
	);

	function formatDate(dateStr: string) {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Admin Dashboard | Portfolio & ATS CV CMS</title>
</svelte:head>

<div class="flex min-h-screen bg-background-dark text-white selection:bg-primary selection:text-white">
	<!-- Sidebar -->
	<aside class="fixed top-0 left-0 z-40 h-screen w-64 border-r border-white/10 bg-black/50 backdrop-blur-md flex flex-col justify-between p-4">
		<div>
			<!-- Logo -->
			<div class="flex h-16 items-center px-4 mb-4 border-b border-white/10">
				<a href="/admin" class="group flex items-center gap-2 text-xl font-bold tracking-tight">
					<span class="text-blue-400">&lt;</span>
					<span>Portfolio CMS</span>
					<span class="text-blue-400">/&gt;</span>
				</a>
			</div>

			<!-- Nav links -->
			<nav class="space-y-1">
				<button
					onclick={() => (activeTab = 'home')}
					class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs font-mono transition-all {activeTab === 'home' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}"
				>
					<Home class="w-4 h-4" />
					<span>Home & Profile</span>
				</button>

				<button
					onclick={() => (activeTab = 'education')}
					class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs font-mono transition-all {activeTab === 'education' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}"
				>
					<GraduationCap class="w-4 h-4" />
					<span>Education ({data.educations?.length || 0})</span>
				</button>

				<button
					onclick={() => (activeTab = 'experience')}
					class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs font-mono transition-all {activeTab === 'experience' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}"
				>
					<Briefcase class="w-4 h-4" />
					<span>Experience ({data.experiences?.length || 0})</span>
				</button>

				<button
					onclick={() => (activeTab = 'projects')}
					class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs font-mono transition-all {activeTab === 'projects' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}"
				>
					<Code2 class="w-4 h-4" />
					<span>Projects ({data.projects?.length || 0})</span>
				</button>

				<button
					onclick={() => (activeTab = 'skills')}
					class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs font-mono transition-all {activeTab === 'skills' ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}"
				>
					<User class="w-4 h-4" />
					<span>Skills & Tools ({data.skills?.length || 0})</span>
				</button>

				<button
					onclick={() => (activeTab = 'achievements')}
					class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs font-mono transition-all {activeTab === 'achievements' ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}"
				>
					<Trophy class="w-4 h-4" />
					<span>Achievements ({data.achievements?.length || 0})</span>
				</button>

				<button
					onclick={() => (activeTab = 'contact')}
					class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs font-mono transition-all {activeTab === 'contact' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}"
				>
					<div class="flex items-center gap-3">
						<Mail class="w-4 h-4" />
						<span>Contact Inbox</span>
					</div>
					{#if unreadCount > 0}
						<span class="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-bold">{unreadCount}</span>
					{/if}
				</button>
			</nav>
		</div>

		<!-- Footer User Info & Links -->
		<div class="space-y-2 pt-3 border-t border-white/10">
			<a
				href="/"
				target="_blank"
				class="flex items-center justify-between px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-mono text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
			>
				<span>View Website</span>
				<ExternalLink class="w-3.5 h-3.5 text-gray-400" />
			</a>

			<a
				href="/cv"
				target="_blank"
				class="flex items-center justify-between px-3.5 py-2 rounded-xl border border-blue-500/30 bg-blue-500/10 text-xs font-mono text-blue-300 hover:bg-blue-500/20 hover:text-white transition-colors"
			>
				<span class="flex items-center gap-1.5">
					<FileText class="w-3.5 h-3.5" />
					Preview ATS CV
				</span>
				<ExternalLink class="w-3.5 h-3.5" />
			</a>

			<form action="?/logout" method="POST" use:enhance>
				<button
					type="submit"
					class="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-mono text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
				>
					<LogOut class="w-4 h-4" />
					<span>Logout</span>
				</button>
			</form>
		</div>
	</aside>

	<!-- Main Content Area -->
	<main class="ml-64 flex-1 p-8 min-h-screen">
		<!-- Notification banners -->
		{#if form?.error}
			<div class="mb-6 mx-auto max-w-2xl p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center gap-3 text-sm font-mono text-center shadow-lg">
				<AlertCircle class="w-5 h-5 shrink-0" />
				<span>{form.error}</span>
			</div>
		{/if}
		{#if form?.message}
			<div class="mb-6 mx-auto max-w-2xl p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center gap-3 text-sm font-mono text-center shadow-lg">
				<CheckCircle2 class="w-5 h-5 shrink-0" />
				<span>{form.message}</span>
			</div>
		{/if}

		<!-- ========================================== -->
		<!-- TAB 1: HOME & PROFILE                      -->
		<!-- ========================================== -->
		{#if activeTab === 'home'}
			<div class="max-w-4xl space-y-6">
				<div class="flex items-center justify-between border-b border-white/10 pb-4">
					<div>
						<h1 class="text-2xl font-bold font-mono">Profile & Home Settings</h1>
						<p class="text-xs text-gray-400 font-mono mt-1">Manage personal bio, contacts, and CV ATS header attributes</p>
					</div>
				</div>

				<form action="?/updateHome" method="POST" enctype="multipart/form-data" use:enhance class="space-y-6">
					<input type="hidden" name="id" value={data.home?.id || ''} />

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="space-y-1.5">
							<label for="full_name" class="text-xs font-mono text-gray-300">Full Name</label>
							<input
								type="text"
								id="full_name"
								name="full_name"
								value={data.home?.full_name || ''}
								class="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
								required
							/>
						</div>

						<div class="space-y-1.5">
							<label for="tagline" class="text-xs font-mono text-gray-300">Tagline / Professional Title</label>
							<input
								type="text"
								id="tagline"
								name="tagline"
								value={data.home?.tagline || ''}
								class="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
							/>
						</div>

						<div class="space-y-1.5">
							<label for="location" class="text-xs font-mono text-gray-300">Location (City, Country)</label>
							<input
								type="text"
								id="location"
								name="location"
								value={data.home?.location || 'Jember, East Java'}
								class="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
							/>
						</div>

						<div class="space-y-1.5">
							<label for="whatsapp_url" class="text-xs font-mono text-gray-300">WhatsApp Direct Link</label>
							<input
								type="url"
								id="whatsapp_url"
								name="whatsapp_url"
								value={data.home?.whatsapp_url || 'https://wa.link/jlntd2'}
								class="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
							/>
						</div>

						<div class="space-y-1.5">
							<label for="contact_email" class="text-xs font-mono text-gray-300">Contact Email</label>
							<input
								type="email"
								id="contact_email"
								name="contact_email"
								value={data.home?.contact_email || ''}
								class="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
							/>
						</div>
					</div>

					<div class="space-y-1.5">
						<label for="bio" class="text-xs font-mono text-gray-300">Summary / Bio</label>
						<textarea
							id="bio"
							name="bio"
							rows="4"
							class="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-blue-500 leading-relaxed"
						>{data.home?.bio || ''}</textarea>
					</div>

					<div class="border-t border-white/10 pt-4 space-y-4">
						<h3 class="text-sm font-bold font-mono text-gray-300">Social Links</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="space-y-1.5">
								<label for="github" class="text-xs font-mono text-gray-400">GitHub Profile URL</label>
								<input
									type="url"
									id="github"
									name="github"
									value={data.home?.social_links?.github || ''}
									class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white"
								/>
							</div>

							<div class="space-y-1.5">
								<label for="linkedin" class="text-xs font-mono text-gray-400">LinkedIn Profile URL</label>
								<input
									type="url"
									id="linkedin"
									name="linkedin"
									value={data.home?.social_links?.linkedin || ''}
									class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white"
								/>
							</div>
						</div>
					</div>

					<div class="pt-4">
						<button
							type="submit"
							class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm font-bold transition-all shadow-lg shadow-blue-500/25"
						>
							<Save class="w-4 h-4" />
							Save Profile Changes
						</button>
					</div>
				</form>
			</div>
		{/if}

		<!-- ========================================== -->
		<!-- TAB 2: EDUCATION                           -->
		<!-- ========================================== -->
		{#if activeTab === 'education'}
			<div class="space-y-6 max-w-5xl">
				<div class="flex items-center justify-between border-b border-white/10 pb-4">
					<div>
						<h1 class="text-2xl font-bold font-mono">Education Management</h1>
						<p class="text-xs text-gray-400 font-mono mt-1">Manage academic background, degrees, GPA, and coursework</p>
					</div>
					<button
						onclick={() => openEducationModal()}
						class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all"
					>
						<Plus class="w-4 h-4" />
						Add Education
					</button>
				</div>

				<div class="grid grid-cols-1 gap-4">
					{#each (data.educations || []) as edu (edu.id)}
						<div class="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div class="space-y-1">
								<div class="flex items-center gap-2">
									<h3 class="font-bold text-white text-base">{edu.institution}</h3>
									<span class="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-gray-400">
										{edu.start_date} – {edu.end_date || 'Present'}
									</span>
								</div>
								<p class="text-emerald-400 text-xs font-mono">{edu.degree}</p>
								{#if edu.gpa}
									<p class="text-xs text-gray-300 font-mono">GPA: {edu.gpa}</p>
								{/if}
								{#if edu.coursework}
									<p class="text-xs text-gray-400 font-mono line-clamp-1">Courses: {edu.coursework}</p>
								{/if}
							</div>

							<div class="flex items-center gap-2 self-end sm:self-center">
								<button
									onclick={() => openEducationModal(edu)}
									class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
									title="Edit"
								>
									<Edit class="w-4 h-4" />
								</button>

								<form action="?/deleteEducation" method="POST" use:enhance>
									<input type="hidden" name="id" value={edu.id} />
									<button
										type="submit"
										onclick={(e) => { if(!confirm('Delete this education entry?')) e.preventDefault(); }}
										class="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
										title="Delete"
									>
										<Trash2 class="w-4 h-4" />
									</button>
								</form>
							</div>
						</div>
					{:else}
						<div class="text-center py-12 text-gray-500 font-mono text-sm">No education records yet.</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- ========================================== -->
		<!-- TAB 3: EXPERIENCE                          -->
		<!-- ========================================== -->
		{#if activeTab === 'experience'}
			<div class="space-y-6 max-w-5xl">
				<div class="flex items-center justify-between border-b border-white/10 pb-4">
					<div>
						<h1 class="text-2xl font-bold font-mono">Work Experience Management</h1>
						<p class="text-xs text-gray-400 font-mono mt-1">Manage professional roles, companies, dates, and bullet points</p>
					</div>
					<button
						onclick={() => openExperienceModal()}
						class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition-all"
					>
						<Plus class="w-4 h-4" />
						Add Experience
					</button>
				</div>

				<div class="space-y-4">
					{#each (data.experiences || []) as exp (exp.id)}
						<div class="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
							<div class="space-y-2 flex-1">
								<div class="flex flex-wrap items-center gap-2">
									<h3 class="font-bold text-white text-base">{exp.role_title}</h3>
									<span class="text-xs font-mono text-red-400">@ {exp.organization}</span>
									<span class="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-gray-400">
										{exp.period_text || (exp.start_date + ' – ' + (exp.end_date || 'Present'))}
									</span>
								</div>

								{#if exp.bullet_points && exp.bullet_points.length > 0}
									<ul class="list-disc list-inside space-y-1 text-xs text-gray-300">
										{#each exp.bullet_points as bullet}
											<li>{bullet}</li>
										{/each}
									</ul>
								{:else if exp.description}
									<p class="text-xs text-gray-400">{exp.description}</p>
								{/if}
							</div>

							<div class="flex items-center gap-2 shrink-0">
								<button
									onclick={() => openExperienceModal(exp)}
									class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
									title="Edit"
								>
									<Edit class="w-4 h-4" />
								</button>

								<form action="?/deleteExperience" method="POST" use:enhance>
									<input type="hidden" name="id" value={exp.id} />
									<button
										type="submit"
										onclick={(e) => { if(!confirm('Delete this experience entry?')) e.preventDefault(); }}
										class="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
										title="Delete"
									>
										<Trash2 class="w-4 h-4" />
									</button>
								</form>
							</div>
						</div>
					{:else}
						<div class="text-center py-12 text-gray-500 font-mono text-sm">No experience records yet.</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- ========================================== -->
		<!-- TAB 4: PROJECTS                            -->
		<!-- ========================================== -->
		{#if activeTab === 'projects'}
			<div class="space-y-6 max-w-5xl">
				<div class="flex items-center justify-between border-b border-white/10 pb-4">
					<div>
						<h1 class="text-2xl font-bold font-mono">Projects Management</h1>
						<p class="text-xs text-gray-400 font-mono mt-1">Manage project showcase, tech stack, bullet points, and repositories</p>
					</div>
					<button
						onclick={() => openProjectModal()}
						class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold transition-all"
					>
						<Plus class="w-4 h-4" />
						Add Project
					</button>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#each (data.projects || []) as proj (proj.id)}
						<div class="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between space-y-4">
							<div class="space-y-2">
								<div class="flex items-start justify-between gap-2">
									<div>
										<h3 class="font-bold text-white text-base">{proj.title}</h3>
										<p class="text-xs font-mono text-amber-400">{proj.subtitle || 'Mobile App'} • {proj.role || 'Developer'}</p>
									</div>
									{#if proj.period}
										<span class="text-[11px] font-mono text-gray-400">{proj.period}</span>
									{/if}
								</div>

								{#if proj.bullet_points && proj.bullet_points.length > 0}
									<ul class="list-disc list-inside space-y-1 text-xs text-gray-300">
										{#each proj.bullet_points as bullet}
											<li class="line-clamp-2">{bullet}</li>
										{/each}
									</ul>
								{:else if proj.description}
									<p class="text-xs text-gray-400 line-clamp-2">{proj.description}</p>
								{/if}

								{#if proj.tech_stack && proj.tech_stack.length > 0}
									<div class="flex flex-wrap gap-1 pt-1">
										{#each proj.tech_stack as t}
											<span class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400">{t}</span>
										{/each}
									</div>
								{/if}
							</div>

							<div class="flex items-center justify-between pt-3 border-t border-white/10">
								<span class="text-xs font-mono text-gray-500">
									Repo: {proj.repo_type === 'private' ? 'Private' : (proj.repo_url ? 'Public' : 'None')}
								</span>
								<div class="flex items-center gap-2">
									<button
										onclick={() => openProjectModal(proj)}
										class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
										title="Edit"
									>
										<Edit class="w-4 h-4" />
									</button>

									<form action="?/deleteProject" method="POST" use:enhance>
										<input type="hidden" name="id" value={proj.id} />
										<button
											type="submit"
											onclick={(e) => { if(!confirm('Delete this project?')) e.preventDefault(); }}
											class="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
											title="Delete"
										>
											<Trash2 class="w-4 h-4" />
										</button>
									</form>
								</div>
							</div>
						</div>
					{:else}
						<div class="text-center py-12 text-gray-500 font-mono text-sm col-span-2">No project records yet.</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- ========================================== -->
		<!-- TAB 5: SKILLS & TOOLS                      -->
		<!-- ========================================== -->
		{#if activeTab === 'skills'}
			<div class="space-y-6 max-w-5xl">
				<div class="flex items-center justify-between border-b border-white/10 pb-4">
					<div>
						<h1 class="text-2xl font-bold font-mono">Skills & Tools Management</h1>
						<p class="text-xs text-gray-400 font-mono mt-1">Manage categorized skills, frameworks, databases, and tools</p>
					</div>
					<button
						onclick={() => openSkillModal()}
						class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono font-bold transition-all"
					>
						<Plus class="w-4 h-4" />
						Add Skill
					</button>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
					{#each (data.skills || []) as sk (sk.id)}
						<div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
							<div class="space-y-0.5">
								<h3 class="font-bold text-white text-sm">{sk.name}</h3>
								<p class="text-[11px] font-mono text-teal-400">{sk.category}</p>
							</div>

							<div class="flex items-center gap-1.5">
								<button
									onclick={() => openSkillModal(sk)}
									class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
									title="Edit"
								>
									<Edit class="w-3.5 h-3.5" />
								</button>

								<form action="?/deleteSkill" method="POST" use:enhance>
									<input type="hidden" name="id" value={sk.id} />
									<button
										type="submit"
										onclick={(e) => { if(!confirm('Delete this skill?')) e.preventDefault(); }}
										class="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
										title="Delete"
									>
										<Trash2 class="w-3.5 h-3.5" />
									</button>
								</form>
							</div>
						</div>
					{:else}
						<div class="text-center py-12 text-gray-500 font-mono text-sm col-span-3">No skills yet.</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- ========================================== -->
		<!-- TAB 6: ACHIEVEMENTS                        -->
		<!-- ========================================== -->
		{#if activeTab === 'achievements'}
			<div class="space-y-6 max-w-5xl">
				<div class="flex items-center justify-between border-b border-white/10 pb-4">
					<div>
						<h1 class="text-2xl font-bold font-mono">Achievements & Honors</h1>
						<p class="text-xs text-gray-400 font-mono mt-1">Manage competition awards, honors, and certificate links</p>
					</div>
					<button
						onclick={() => openAchievementModal()}
						class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-mono font-bold transition-all"
					>
						<Plus class="w-4 h-4" />
						Add Achievement
					</button>
				</div>

				<div class="space-y-4">
					{#each (data.achievements || []) as ach (ach.id)}
						<div class="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
							<div class="space-y-1.5">
								<div class="flex items-center gap-2">
									<h3 class="font-bold text-white text-base">{ach.title}</h3>
									{#if ach.period}
										<span class="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-yellow-400">
											{ach.period}
										</span>
									{/if}
								</div>
								{#if ach.description}
									<p class="text-xs font-mono text-gray-300">{ach.description}</p>
								{/if}
								{#if ach.certificate_url}
									<a href={ach.certificate_url} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline font-mono">
										<span>E-sertifikat Link</span>
										<ExternalLink class="w-3 h-3" />
									</a>
								{/if}
							</div>

							<div class="flex items-center gap-2 self-end sm:self-center">
								<button
									onclick={() => openAchievementModal(ach)}
									class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
									title="Edit"
								>
									<Edit class="w-4 h-4" />
								</button>

								<form action="?/deleteAchievement" method="POST" use:enhance>
									<input type="hidden" name="id" value={ach.id} />
									<button
										type="submit"
										onclick={(e) => { if(!confirm('Delete this achievement?')) e.preventDefault(); }}
										class="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
										title="Delete"
									>
										<Trash2 class="w-4 h-4" />
									</button>
								</form>
							</div>
						</div>
					{:else}
						<div class="text-center py-12 text-gray-500 font-mono text-sm">No achievement records yet.</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- ========================================== -->
		<!-- TAB 7: CONTACT MESSAGES                    -->
		<!-- ========================================== -->
		{#if activeTab === 'contact'}
			<div class="space-y-6 max-w-5xl">
				<div class="border-b border-white/10 pb-4">
					<h1 class="text-2xl font-bold font-mono">Contact Inbox</h1>
					<p class="text-xs text-gray-400 font-mono mt-1">Read visitor submissions from the contact form</p>
				</div>

				<div class="space-y-3">
					{#each (data.contactMessages || []) as msg (msg.id)}
						<div class="p-4 rounded-xl border {msg.is_read ? 'bg-white/[0.02] border-white/5 text-gray-400' : 'bg-white/[0.06] border-white/15 text-white'} flex items-start justify-between gap-4">
							<div class="space-y-1">
								<div class="flex items-center gap-2">
									<span class="font-bold text-sm text-white">{msg.name}</span>
									<span class="text-xs font-mono text-gray-400">&lt;{msg.email}&gt;</span>
									<span class="text-[10px] font-mono text-gray-500">{formatDate(msg.created_at)}</span>
								</div>
								<p class="text-xs font-mono font-medium text-blue-400">{msg.subject}</p>
								<p class="text-xs text-gray-300 line-clamp-2">{msg.message}</p>
							</div>

							<div class="flex items-center gap-2">
								<form action="?/toggleReadMessage" method="POST" use:enhance>
									<input type="hidden" name="id" value={msg.id} />
									<input type="hidden" name="is_read" value={msg.is_read.toString()} />
									<button type="submit" class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300" title={msg.is_read ? 'Mark unread' : 'Mark read'}>
										{#if msg.is_read}
											<EyeOff class="w-4 h-4" />
										{:else}
											<Eye class="w-4 h-4 text-emerald-400" />
										{/if}
									</button>
								</form>

								<form action="?/deleteMessage" method="POST" use:enhance>
									<input type="hidden" name="id" value={msg.id} />
									<button
										type="submit"
										onclick={(e) => { if(!confirm('Delete this message?')) e.preventDefault(); }}
										class="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
										title="Delete"
									>
										<Trash2 class="w-4 h-4" />
									</button>
								</form>
							</div>
						</div>
					{:else}
						<div class="text-center py-12 text-gray-500 font-mono text-sm">Inbox is empty.</div>
					{/each}
				</div>
			</div>
		{/if}
	</main>
</div>

<!-- ========================================== -->
<!-- MODAL: EDUCATION                           -->
<!-- ========================================== -->
{#if showEducationModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
		<div class="w-full max-w-lg rounded-2xl bg-zinc-900 border border-white/15 p-6 space-y-4">
			<div class="flex items-center justify-between border-b border-white/10 pb-3">
				<h2 class="text-lg font-bold font-mono text-white">
					{editingEducation ? 'Edit Education' : 'Add Education'}
				</h2>
				<button onclick={() => (showEducationModal = false)} class="text-gray-400 hover:text-white">✕</button>
			</div>

			<form action="?/saveEducation" method="POST" use:enhance={() => {
				return async ({ update }) => {
					await update();
					showEducationModal = false;
				};
			}} class="space-y-4">
				<input type="hidden" name="id" value={editingEducation?.id || ''} />

				<div class="space-y-1">
					<label for="institution" class="text-xs font-mono text-gray-300">Institution / University</label>
					<input
						type="text"
						id="institution"
						name="institution"
						value={editingEducation?.institution || ''}
						placeholder="e.g. University of Jember"
						class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						required
					/>
				</div>

				<div class="space-y-1">
					<label for="degree" class="text-xs font-mono text-gray-300">Degree / Major / Faculty</label>
					<input
						type="text"
						id="degree"
						name="degree"
						value={editingEducation?.degree || ''}
						placeholder="e.g. Information Technology, Faculty of Computer Science"
						class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						required
					/>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1">
						<label for="edu_start_date" class="text-xs font-mono text-gray-300">Start Date</label>
						<input
							type="text"
							id="edu_start_date"
							name="start_date"
							value={editingEducation?.start_date || 'Aug 2022'}
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
							required
						/>
					</div>

					<div class="space-y-1">
						<label for="edu_end_date" class="text-xs font-mono text-gray-300">End Date</label>
						<input
							type="text"
							id="edu_end_date"
							name="end_date"
							value={editingEducation?.end_date || 'Present'}
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1">
						<label for="gpa" class="text-xs font-mono text-gray-300">GPA</label>
						<input
							type="text"
							id="gpa"
							name="gpa"
							value={editingEducation?.gpa || '3.83 / 4.00'}
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>

					<div class="space-y-1">
						<label for="edu_order" class="text-xs font-mono text-gray-300">Display Order</label>
						<input
							type="number"
							id="edu_order"
							name="display_order"
							value={editingEducation?.display_order || 1}
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>
				</div>

				<div class="space-y-1">
					<label for="coursework" class="text-xs font-mono text-gray-300">Relevant Coursework (comma separated)</label>
					<textarea
						id="coursework"
						name="coursework"
						rows="3"
						class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white leading-relaxed"
					>{editingEducation?.coursework || ''}</textarea>
				</div>

				<div class="flex justify-end gap-2 pt-2 border-t border-white/10">
					<button
						type="button"
						onclick={() => (showEducationModal = false)}
						class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-mono font-bold text-white shadow-lg"
					>
						Save Education
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- ========================================== -->
<!-- MODAL: EXPERIENCE                          -->
<!-- ========================================== -->
{#if showExperienceModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
		<div class="w-full max-w-lg rounded-2xl bg-zinc-900 border border-white/15 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between border-b border-white/10 pb-3">
				<h2 class="text-lg font-bold font-mono text-white">
					{editingExperience ? 'Edit Experience' : 'Add Experience'}
				</h2>
				<button onclick={() => (showExperienceModal = false)} class="text-gray-400 hover:text-white">✕</button>
			</div>

			<form action="?/saveExperience" method="POST" use:enhance={() => {
				return async ({ update }) => {
					await update();
					showExperienceModal = false;
				};
			}} class="space-y-4">
				<input type="hidden" name="id" value={editingExperience?.id || ''} />

				<div class="space-y-1">
					<label for="role_title" class="text-xs font-mono text-gray-300">Role Title</label>
					<input
						type="text"
						id="role_title"
						name="role_title"
						value={editingExperience?.role_title || ''}
						placeholder="e.g. Cohort – Mobile Development (Android)"
						class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						required
					/>
				</div>

				<div class="space-y-1">
					<label for="organization" class="text-xs font-mono text-gray-300">Company / Organization</label>
					<input
						type="text"
						id="organization"
						name="organization"
						value={editingExperience?.organization || ''}
						placeholder="e.g. Bangkit Academy led by Google..."
						class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						required
					/>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1">
						<label for="period_text" class="text-xs font-mono text-gray-300">Period Text (CV Format)</label>
						<input
							type="text"
							id="period_text"
							name="period_text"
							value={editingExperience?.period_text || ''}
							placeholder="e.g. Sep 2024 – Des 2025"
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>

					<div class="space-y-1">
						<label for="exp_location" class="text-xs font-mono text-gray-300">Location</label>
						<input
							type="text"
							id="exp_location"
							name="location"
							value={editingExperience?.location || 'Indonesia'}
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-3">
					<div class="space-y-1">
						<label for="exp_start_date" class="text-xs font-mono text-gray-300">Start Date</label>
						<input
							type="date"
							id="exp_start_date"
							name="start_date"
							value={editingExperience?.start_date || '2024-07-01'}
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>

					<div class="space-y-1">
						<label for="exp_end_date" class="text-xs font-mono text-gray-300">End Date</label>
						<input
							type="date"
							id="exp_end_date"
							name="end_date"
							value={editingExperience?.end_date || ''}
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>

					<div class="space-y-1">
						<label for="exp_order" class="text-xs font-mono text-gray-300">Order</label>
						<input
							type="number"
							id="exp_order"
							name="display_order"
							value={editingExperience?.display_order || 1}
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>
				</div>

				<div class="space-y-1">
					<label for="exp_bullets" class="text-xs font-mono text-gray-300">Bullet Points (1 item per baris)</label>
					<textarea
						id="exp_bullets"
						name="bullet_points"
						rows="4"
						placeholder="• Built and integrated Android apps with Kotlin...&#10;• Developed soft skills for personal growth..."
						class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white leading-relaxed"
					>{editingExperience?.bullet_points?.join('\n') || editingExperience?.description || ''}</textarea>
				</div>

				<div class="flex justify-end gap-2 pt-2 border-t border-white/10">
					<button
						type="button"
						onclick={() => (showExperienceModal = false)}
						class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-mono font-bold text-white shadow-lg"
					>
						Save Experience
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- ========================================== -->
<!-- MODAL: PROJECT                             -->
<!-- ========================================== -->
{#if showProjectModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
		<div class="w-full max-w-xl rounded-2xl bg-zinc-900 border border-white/15 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between border-b border-white/10 pb-3">
				<h2 class="text-lg font-bold font-mono text-white">
					{editingProject ? 'Edit Project' : 'Add Project'}
				</h2>
				<button onclick={() => (showProjectModal = false)} class="text-gray-400 hover:text-white">✕</button>
			</div>

			<form action="?/saveProject" method="POST" enctype="multipart/form-data" use:enhance={() => {
				return async ({ update }) => {
					await update();
					showProjectModal = false;
				};
			}} class="space-y-4">
				<input type="hidden" name="id" value={editingProject?.id || ''} />

				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1">
						<label for="proj_title" class="text-xs font-mono text-gray-300">Project Title</label>
						<input
							type="text"
							id="proj_title"
							name="title"
							value={editingProject?.title || ''}
							placeholder="e.g. Kelolain"
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
							required
						/>
					</div>

					<div class="space-y-1">
						<label for="subtitle" class="text-xs font-mono text-gray-300">Subtitle / Type</label>
						<input
							type="text"
							id="subtitle"
							name="subtitle"
							value={editingProject?.subtitle || 'Mobile Apps'}
							placeholder="e.g. Mobile Apps, Android Apps"
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-3">
					<div class="space-y-1">
						<label for="proj_role" class="text-xs font-mono text-gray-300">Role</label>
						<input
							type="text"
							id="proj_role"
							name="role"
							value={editingProject?.role || 'Mobile Development'}
							placeholder="e.g. Designer, Mobile Dev"
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>

					<div class="space-y-1">
						<label for="proj_period" class="text-xs font-mono text-gray-300">Period</label>
						<input
							type="text"
							id="proj_period"
							name="period"
							value={editingProject?.period || ''}
							placeholder="e.g. Jul – Aug 2024"
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>

					<div class="space-y-1">
						<label for="repo_type" class="text-xs font-mono text-gray-300">Repository Status</label>
						<select
							id="repo_type"
							name="repo_type"
							class="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-white/10 text-xs font-mono text-white"
						>
							<option value="public" selected={editingProject?.repo_type !== 'private'}>Public Repo</option>
							<option value="private" selected={editingProject?.repo_type === 'private'}>Private Project</option>
						</select>
					</div>
				</div>

				<div class="space-y-1">
					<label for="proj_bullets" class="text-xs font-mono text-gray-300">Bullet Points (1 baris per poin fitur / CV)</label>
					<textarea
						id="proj_bullets"
						name="bullet_points"
						rows="3"
						placeholder="• Developed a mobile application to prevent online loan fraud...&#10;• The app also includes quizzes..."
						class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white leading-relaxed"
					>{editingProject?.bullet_points?.join('\n') || editingProject?.description || ''}</textarea>
				</div>

				<div class="space-y-1">
					<label for="tech_stack" class="text-xs font-mono text-gray-300">Tech Stack (comma separated)</label>
					<input
						type="text"
						id="tech_stack"
						name="tech_stack"
						value={editingProject?.tech_stack?.join(', ') || ''}
						placeholder="Flutter, GetX, Firebase, Midtrans"
						class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
					/>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1">
						<label for="repo_url" class="text-xs font-mono text-gray-300">Repository URL (GitHub)</label>
						<input
							type="url"
							id="repo_url"
							name="repo_url"
							value={editingProject?.repo_url || ''}
							placeholder="https://github.com/..."
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>

					<div class="space-y-1">
						<label for="demo_url" class="text-xs font-mono text-gray-300">Live Demo URL</label>
						<input
							type="url"
							id="demo_url"
							name="demo_url"
							value={editingProject?.demo_url || ''}
							placeholder="https://..."
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-3 items-center">
					<div class="space-y-1">
						<label for="proj_order" class="text-xs font-mono text-gray-300">Display Order</label>
						<input
							type="number"
							id="proj_order"
							name="display_order"
							value={editingProject?.display_order || 1}
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>

					<div class="pt-5">
						<label class="flex items-center gap-2 cursor-pointer font-mono text-xs text-gray-300">
							<input
								type="checkbox"
								name="is_featured"
								checked={editingProject?.is_featured || false}
								class="rounded bg-white/10 border-white/20 text-amber-500"
							/>
							<span>Featured Project</span>
						</label>
					</div>
				</div>

				<div class="flex justify-end gap-2 pt-2 border-t border-white/10">
					<button
						type="button"
						onclick={() => (showProjectModal = false)}
						class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-mono font-bold text-white shadow-lg"
					>
						Save Project
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- ========================================== -->
<!-- MODAL: SKILL                               -->
<!-- ========================================== -->
{#if showSkillModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
		<div class="w-full max-w-md rounded-2xl bg-zinc-900 border border-white/15 p-6 space-y-4">
			<div class="flex items-center justify-between border-b border-white/10 pb-3">
				<h2 class="text-lg font-bold font-mono text-white">
					{editingSkill ? 'Edit Skill' : 'Add Skill'}
				</h2>
				<button onclick={() => (showSkillModal = false)} class="text-gray-400 hover:text-white">✕</button>
			</div>

			<form action="?/saveSkill" method="POST" use:enhance={() => {
				return async ({ update }) => {
					await update();
					showSkillModal = false;
				};
			}} class="space-y-4">
				<input type="hidden" name="id" value={editingSkill?.id || ''} />

				<div class="space-y-1">
					<label for="skill_name" class="text-xs font-mono text-gray-300">Skill / Tool Name</label>
					<input
						type="text"
						id="skill_name"
						name="name"
						value={editingSkill?.name || ''}
						placeholder="e.g. Flutter, Kotlin, Firebase"
						class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						required
					/>
				</div>

				<div class="space-y-1">
					<label for="category" class="text-xs font-mono text-gray-300">Category</label>
					<select
						id="category"
						name="category"
						class="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-white/10 text-xs font-mono text-white"
					>
						<option value="Programming Languages" selected={editingSkill?.category === 'Programming Languages'}>Programming Languages</option>
						<option value="Frameworks" selected={editingSkill?.category === 'Frameworks'}>Frameworks</option>
						<option value="Database" selected={editingSkill?.category === 'Database'}>Database</option>
						<option value="Tools" selected={editingSkill?.category === 'Tools'}>Tools</option>
						<option value="Soft Skills" selected={editingSkill?.category === 'Soft Skills'}>Soft Skills</option>
						<option value="Languages" selected={editingSkill?.category === 'Languages'}>Languages</option>
					</select>
				</div>

				<div class="space-y-1">
					<label for="skill_order" class="text-xs font-mono text-gray-300">Display Order</label>
					<input
						type="number"
						id="skill_order"
						name="display_order"
						value={editingSkill?.display_order || 1}
						class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
					/>
				</div>

				<div class="flex justify-end gap-2 pt-2 border-t border-white/10">
					<button
						type="button"
						onclick={() => (showSkillModal = false)}
						class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-mono font-bold text-white shadow-lg"
					>
						Save Skill
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- ========================================== -->
<!-- MODAL: ACHIEVEMENT                         -->
<!-- ========================================== -->
{#if showAchievementModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
		<div class="w-full max-w-md rounded-2xl bg-zinc-900 border border-white/15 p-6 space-y-4">
			<div class="flex items-center justify-between border-b border-white/10 pb-3">
				<h2 class="text-lg font-bold font-mono text-white">
					{editingAchievement ? 'Edit Achievement' : 'Add Achievement'}
				</h2>
				<button onclick={() => (showAchievementModal = false)} class="text-gray-400 hover:text-white">✕</button>
			</div>

			<form action="?/saveAchievement" method="POST" use:enhance={() => {
				return async ({ update }) => {
					await update();
					showAchievementModal = false;
				};
			}} class="space-y-4">
				<input type="hidden" name="id" value={editingAchievement?.id || ''} />

				<div class="space-y-1">
					<label for="ach_title" class="text-xs font-mono text-gray-300">Title / Award</label>
					<input
						type="text"
						id="ach_title"
						name="title"
						value={editingAchievement?.title || ''}
						placeholder="e.g. Winner Competition Software Development in CODE 2024"
						class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						required
					/>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1">
						<label for="ach_period" class="text-xs font-mono text-gray-300">Period / Date</label>
						<input
							type="text"
							id="ach_period"
							name="period"
							value={editingAchievement?.period || 'Aug 2024'}
							placeholder="e.g. Aug 2024"
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>

					<div class="space-y-1">
						<label for="ach_order" class="text-xs font-mono text-gray-300">Display Order</label>
						<input
							type="number"
							id="ach_order"
							name="display_order"
							value={editingAchievement?.display_order || 1}
							class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
						/>
					</div>
				</div>

				<div class="space-y-1">
					<label for="ach_description" class="text-xs font-mono text-gray-300">Description / Subtitle</label>
					<input
						type="text"
						id="ach_description"
						name="description"
						value={editingAchievement?.description || ''}
						placeholder="e.g. 3rd place from 16 teams"
						class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
					/>
				</div>

				<div class="space-y-1">
					<label for="certificate_url" class="text-xs font-mono text-gray-300">Certificate URL (Google Drive / Verification)</label>
					<input
						type="url"
						id="certificate_url"
						name="certificate_url"
						value={editingAchievement?.certificate_url || ''}
						placeholder="https://drive.google.com/..."
						class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
					/>
				</div>

				<div class="flex justify-end gap-2 pt-2 border-t border-white/10">
					<button
						type="button"
						onclick={() => (showAchievementModal = false)}
						class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="px-5 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-xs font-mono font-bold text-white shadow-lg"
					>
						Save Achievement
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
