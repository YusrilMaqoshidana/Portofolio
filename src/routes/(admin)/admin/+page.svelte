<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		Home,
		Briefcase,
		Code2,
		GraduationCap,
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
		Send
	} from 'lucide-svelte';
	import type { ProjectSection, SkillSection, ExperienceSection, ContactMessage } from '$lib/supabase/types';

	let { data, form } = $props();

	// Active tab: 'home' | 'projects' | 'skills' | 'experience' | 'contact'
	let activeTab = $state<'home' | 'projects' | 'skills' | 'experience' | 'contact'>('home');
	let loading = $state(false);

	// Edit states
	let editingProject = $state<ProjectSection | null>(null);
	let editingSkill = $state<SkillSection | null>(null);
	let editingExperience = $state<ExperienceSection | null>(null);
	let selectedMessage = $state<ContactMessage | null>(null);

	// Modal show states
	let showProjectModal = $state(false);
	let showSkillModal = $state(false);
	let showExperienceModal = $state(false);
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
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Admin Dashboard | Portfolio CMS</title>
</svelte:head>

<div class="flex min-h-screen bg-background-dark text-white selection:bg-primary selection:text-white">
	<!-- Sidebar -->
	<aside class="fixed top-0 left-0 z-40 h-screen w-64 border-r border-white/10 bg-black/40 backdrop-blur-md flex flex-col justify-between p-4">
		<div>
			<!-- Logo -->
			<div class="flex h-16 items-center px-4 mb-6 border-b border-white/10">
				<a href="/admin" class="group flex items-center gap-2 text-xl font-bold tracking-tight">
					<span class="text-primary">&lt;</span>
					<span>Admin CMS</span>
					<span class="text-primary">/&gt;</span>
				</a>
			</div>

			<!-- Nav links -->
			<nav class="space-y-1.5">
				<button
					onclick={() => (activeTab = 'home')}
					class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all {activeTab === 'home' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}"
				>
					<Home class="w-5 h-5" />
					<span>Home Section</span>
				</button>

				<button
					onclick={() => (activeTab = 'projects')}
					class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all {activeTab === 'projects' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}"
				>
					<Briefcase class="w-5 h-5" />
					<span>Projects ({data.projects.length})</span>
				</button>

				<button
					onclick={() => (activeTab = 'skills')}
					class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all {activeTab === 'skills' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}"
				>
					<Code2 class="w-5 h-5" />
					<span>Skills ({data.skills.length})</span>
				</button>

				<button
					onclick={() => (activeTab = 'experience')}
					class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all {activeTab === 'experience' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}"
				>
					<GraduationCap class="w-5 h-5" />
					<span>Experience ({data.experiences.length})</span>
				</button>

				<button
					onclick={() => (activeTab = 'contact')}
					class="w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all {activeTab === 'contact' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}"
				>
					<div class="flex items-center gap-3">
						<Mail class="w-5 h-5" />
						<span>Contact & Messages</span>
					</div>
					{#if unreadCount > 0}
						<span class="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-bold">{unreadCount}</span>
					{/if}
				</button>
			</nav>
		</div>

		<!-- Footer User Info & Logout -->
		<div class="space-y-3 pt-4 border-t border-white/10">
			<a
				href="/"
				target="_blank"
				class="flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
			>
				<span>View Public Site</span>
				<ExternalLink class="w-3.5 h-3.5" />
			</a>

			<div class="flex items-center gap-3 px-3 py-2">
				<div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
					<User class="w-4 h-4" />
				</div>
				<div class="flex-1 overflow-hidden">
					<p class="text-xs font-semibold text-white truncate">{data.session?.user?.email || 'Admin User'}</p>
					<p class="text-[10px] text-gray-400">Authenticated</p>
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
					class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors"
				>
					<LogOut class="w-4 h-4" />
					<span>Logout</span>
				</button>
			</form>
		</div>
	</aside>

	<!-- Main Content Area -->
	<main class="ml-64 flex-1 p-8 max-w-6xl">
		<!-- Feedback Banners -->
		{#if form?.message}
			<div class="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm flex items-center gap-3">
				<CheckCircle2 class="w-5 h-5 flex-shrink-0" />
				<span>{form.message}</span>
			</div>
		{/if}

		{#if form?.error}
			<div class="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm flex items-center gap-3">
				<AlertCircle class="w-5 h-5 flex-shrink-0" />
				<span>{form.error}</span>
			</div>
		{/if}

		<!-- TAB 1: HOME SECTION -->
		{#if activeTab === 'home'}
			<div class="space-y-6">
				<div>
					<h1 class="text-2xl font-bold text-white">Home Section Management</h1>
					<p class="text-sm text-gray-400">Update your hero header, bio, tagline, contact email, social links, avatar, and resume.</p>
				</div>

				<form
					method="POST"
					action="?/updateHome"
					enctype="multipart/form-data"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update({ reset: false });
							loading = false;
						};
					}}
					class="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6"
				>
					<input type="hidden" name="id" value={data.home?.id || ''} />

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="space-y-2">
							<label for="full_name" class="text-xs font-medium text-gray-300">Full Name</label>
							<input
								id="full_name"
								type="text"
								name="full_name"
								value={data.home?.full_name || ''}
								required
								class="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:border-primary focus:outline-none"
							/>
						</div>

						<div class="space-y-2">
							<label for="tagline" class="text-xs font-medium text-gray-300">Tagline / Professional Title</label>
							<input
								id="tagline"
								type="text"
								name="tagline"
								value={data.home?.tagline || ''}
								class="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:border-primary focus:outline-none"
							/>
						</div>
					</div>

					<div class="space-y-2">
						<label for="contact_email" class="text-xs font-medium text-gray-300">Contact Email (Tampil di bagian Contact & Form)</label>
						<input
							id="contact_email"
							type="email"
							name="contact_email"
							value={data.home?.contact_email || 'yusril.maqoshidana@gmail.com'}
							placeholder="nama@domain.com"
							class="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:border-primary focus:outline-none"
						/>
					</div>

					<div class="space-y-2">
						<label for="bio" class="text-xs font-medium text-gray-300">Bio / About Me</label>
						<textarea
							id="bio"
							name="bio"
							rows="4"
							class="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:border-primary focus:outline-none"
						>{data.home?.bio || ''}</textarea>
					</div>

					<!-- Uploads & Image URLs -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
						<!-- Avatar -->
						<div class="space-y-3">
							<label for="avatar_file" class="text-xs font-medium text-gray-300">Avatar Image</label>
							{#if data.home?.avatar_url}
								<div class="flex items-center gap-3">
									<img src={data.home.avatar_url} alt="Avatar" class="w-16 h-16 rounded-full object-cover border border-white/20" />
									<input type="hidden" name="avatar_url" value={data.home.avatar_url} />
								</div>
							{/if}
							<input
								id="avatar_file"
								type="file"
								name="avatar_file"
								accept="image/*"
								class="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
							/>
						</div>

						<!-- Resume PDF -->
						<div class="space-y-3">
							<label for="resume_file" class="text-xs font-medium text-gray-300">Resume PDF Document</label>
							{#if data.home?.resume_url}
								<div class="text-xs text-gray-300 flex items-center gap-2">
									<a href={data.home.resume_url} target="_blank" class="text-primary underline">Current Resume Link</a>
									<input type="hidden" name="resume_url" value={data.home.resume_url} />
								</div>
							{/if}
							<input
								id="resume_file"
								type="file"
								name="resume_file"
								accept=".pdf,.doc,.docx"
								class="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
							/>
						</div>
					</div>

					<!-- Social Links -->
					<div class="space-y-4 pt-4 border-t border-white/10">
						<h3 class="text-sm font-semibold text-white">Social Media Links</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label for="github" class="text-xs font-medium text-gray-400">GitHub URL</label>
								<input
									id="github"
									type="url"
									name="github"
									value={data.home?.social_links?.github || ''}
									placeholder="https://github.com/username"
									class="w-full px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-xs"
								/>
							</div>

							<div>
								<label for="linkedin" class="text-xs font-medium text-gray-400">LinkedIn URL</label>
								<input
									id="linkedin"
									type="url"
									name="linkedin"
									value={data.home?.social_links?.linkedin || ''}
									placeholder="https://linkedin.com/in/username"
									class="w-full px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-xs"
								/>
							</div>

							<div>
								<label for="instagram" class="text-xs font-medium text-gray-400">Instagram URL</label>
								<input
									id="instagram"
									type="url"
									name="instagram"
									value={data.home?.social_links?.instagram || ''}
									placeholder="https://instagram.com/username"
									class="w-full px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-xs"
								/>
							</div>

							<div>
								<label for="twitter" class="text-xs font-medium text-gray-400">Twitter URL</label>
								<input
									id="twitter"
									type="url"
									name="twitter"
									value={data.home?.social_links?.twitter || ''}
									placeholder="https://twitter.com/username"
									class="w-full px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-xs"
								/>
							</div>
						</div>
					</div>

					<div class="pt-4 flex justify-end">
						<button
							type="submit"
							disabled={loading}
							class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
						>
							<Save class="w-4 h-4" />
							<span>{loading ? 'Saving...' : 'Save Home Settings'}</span>
						</button>
					</div>
				</form>
			</div>
		{/if}

		<!-- TAB 2: PROJECTS -->
		{#if activeTab === 'projects'}
			<div class="space-y-6">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-2xl font-bold text-white">Projects Management</h1>
						<p class="text-sm text-gray-400">Add, edit, or delete portfolio projects and order them.</p>
					</div>

					<button
						onclick={() => openProjectModal()}
						class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
					>
						<Plus class="w-4 h-4" />
						<span>Add Project</span>
					</button>
				</div>

				<!-- Table of projects -->
				<div class="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
					<table class="w-full text-left text-sm text-gray-300">
						<thead class="border-b border-white/10 bg-white/5 text-xs text-gray-400 uppercase">
							<tr>
								<th class="p-4">Order</th>
								<th class="p-4">Project</th>
								<th class="p-4">Tech Stack</th>
								<th class="p-4">Featured</th>
								<th class="p-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-white/5">
							{#each data.projects as project (project.id)}
								<tr class="hover:bg-white/5 transition-colors">
									<td class="p-4 font-mono text-xs">{project.display_order}</td>
									<td class="p-4">
										<div class="flex items-center gap-3">
											{#if project.thumbnail_url}
												<img src={project.thumbnail_url} alt={project.title} class="w-12 h-10 rounded-lg object-cover border border-white/10" />
											{/if}
											<div>
												<p class="font-semibold text-white">{project.title}</p>
												<p class="text-xs text-gray-400 truncate max-w-xs">{project.description}</p>
											</div>
										</div>
									</td>
									<td class="p-4">
										<div class="flex flex-wrap gap-1">
											{#each project.tech_stack || [] as tech}
												<span class="px-2 py-0.5 rounded bg-white/10 text-[10px] text-gray-300">{tech}</span>
											{/each}
										</div>
									</td>
									<td class="p-4">
										{#if project.is_featured}
											<span class="px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold">Featured</span>
										{:else}
											<span class="text-xs text-gray-500">-</span>
										{/if}
									</td>
									<td class="p-4 text-right">
										<div class="flex items-center justify-end gap-2">
											<button
												onclick={() => openProjectModal(project)}
												class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
											>
												<Edit class="w-4 h-4" />
											</button>

											<form method="POST" action="?/deleteProject" use:enhance>
												<input type="hidden" name="id" value={project.id} />
												<button
													type="submit"
													onclick={(e) => !confirm('Delete project?') && e.preventDefault()}
													class="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
												>
													<Trash2 class="w-4 h-4" />
												</button>
											</form>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		<!-- TAB 3: SKILLS -->
		{#if activeTab === 'skills'}
			<div class="space-y-6">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-2xl font-bold text-white">Skills Management</h1>
						<p class="text-sm text-gray-400">Manage technical skills, proficiency levels, and categories.</p>
					</div>

					<button
						onclick={() => openSkillModal()}
						class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
					>
						<Plus class="w-4 h-4" />
						<span>Add Skill</span>
					</button>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each data.skills as skill (skill.id)}
						<div class="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-3 flex justify-between items-start">
							<div>
								<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary">{skill.category}</span>
								<h3 class="text-lg font-bold text-white mt-1">{skill.name}</h3>
								<p class="text-xs text-gray-400">Proficiency: {skill.proficiency_level} / 5</p>
							</div>

							<div class="flex items-center gap-2">
								<button onclick={() => openSkillModal(skill)} class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300">
									<Edit class="w-4 h-4" />
								</button>
								<form method="POST" action="?/deleteSkill" use:enhance>
									<input type="hidden" name="id" value={skill.id} />
									<button
										type="submit"
										onclick={(e) => !confirm('Delete skill?') && e.preventDefault()}
										class="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
									>
										<Trash2 class="w-4 h-4" />
									</button>
								</form>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- TAB 4: EXPERIENCE -->
		{#if activeTab === 'experience'}
			<div class="space-y-6">
				<div class="flex items-center justify-between">
					<div>
						<h1 class="text-2xl font-bold text-white">Experience Management</h1>
						<p class="text-sm text-gray-400">Manage work history, organizations, roles, and dates.</p>
					</div>

					<button
						onclick={() => openExperienceModal()}
						class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
					>
						<Plus class="w-4 h-4" />
						<span>Add Experience</span>
					</button>
				</div>

				<div class="space-y-4">
					{#each data.experiences as exp (exp.id)}
						<div class="p-6 rounded-2xl border border-white/10 bg-white/5 flex items-start justify-between gap-4">
							<div class="space-y-2">
								<h3 class="text-xl font-bold text-white">{exp.role_title}</h3>
								<p class="text-sm font-medium text-primary">{exp.organization}</p>
								<p class="text-xs text-gray-400">{exp.start_date} - {exp.end_date || 'Present'}</p>
								<p class="text-sm text-gray-300 leading-relaxed">{exp.description}</p>
							</div>

							<div class="flex items-center gap-2">
								<button onclick={() => openExperienceModal(exp)} class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300">
									<Edit class="w-4 h-4" />
								</button>
								<form method="POST" action="?/deleteExperience" use:enhance>
									<input type="hidden" name="id" value={exp.id} />
									<button
										type="submit"
										onclick={(e) => !confirm('Delete experience?') && e.preventDefault()}
										class="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
									>
										<Trash2 class="w-4 h-4" />
									</button>
								</form>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- TAB 5: CONTACT & MESSAGES -->
		{#if activeTab === 'contact'}
			<div class="space-y-8">
				<div>
					<h1 class="text-2xl font-bold text-white">Contact & Inbox Management</h1>
					<p class="text-sm text-gray-400">Atur email kontak portfolio dan lihat semua pesan yang dikirim oleh pengunjung website.</p>
				</div>

				<!-- Quick Settings: Contact Email -->
				<div class="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
					<h2 class="text-lg font-bold text-white flex items-center gap-2">
						<Mail class="w-5 h-5 text-primary" />
						<span>Pengaturan Email Contact</span>
					</h2>
					<p class="text-xs text-gray-400">Email ini digunakan pada publikasi portofolio agar pengunjung dapat menghubungi Anda secara langsung.</p>

					<form
						method="POST"
						action="?/updateContactEmail"
						use:enhance={() => {
							loading = true;
							return async ({ update }) => {
								await update();
								loading = false;
							};
						}}
						class="flex flex-col sm:flex-row items-center gap-3"
					>
						<input
							type="email"
							name="contact_email"
							value={data.home?.contact_email || 'yusril.maqoshidana@gmail.com'}
							required
							placeholder="Masukkan email kontak"
							class="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:border-primary focus:outline-none"
						/>

						<button
							type="submit"
							disabled={loading}
							class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
						>
							<Save class="w-4 h-4" />
							<span>{loading ? 'Menyimpan...' : 'Simpan Email'}</span>
						</button>
					</form>
				</div>

				<!-- Contact Messages Inbox -->
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<h2 class="text-xl font-bold text-white flex items-center gap-2">
							<span>Kotak Masuk Pesan</span>
							<span class="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-mono text-gray-300">
								{data.contactMessages.length} Total
							</span>
						</h2>

						{#if unreadCount > 0}
							<span class="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
								{unreadCount} Pesan Belum Dibaca
							</span>
						{/if}
					</div>

					{#if data.contactMessages.length === 0}
						<div class="p-12 text-center rounded-2xl border border-white/10 bg-white/5 space-y-3">
							<Mail class="w-12 h-12 text-gray-500 mx-auto opacity-50" />
							<h3 class="text-base font-semibold text-white">Belum Ada Pesan Masuk</h3>
							<p class="text-xs text-gray-400 max-w-sm mx-auto">
								Pesan yang dikirim pengunjung melalui formulir kontak portofolio Anda akan muncul di sini.
							</p>
						</div>
					{:else}
						<div class="space-y-3">
							{#each data.contactMessages as msg (msg.id)}
								<div
									class="p-5 rounded-2xl border transition duration-200 space-y-3 {msg.is_read ? 'border-white/10 bg-white/5 opacity-80' : 'border-primary/40 bg-primary/5 shadow-lg shadow-primary/5'}"
								>
									<div class="flex flex-wrap items-start justify-between gap-3">
										<div class="space-y-1">
											<div class="flex items-center gap-2 flex-wrap">
												<h3 class="text-base font-bold text-white">{msg.name}</h3>
												<span class="text-xs text-gray-400 font-mono">&lt;{msg.email}&gt;</span>
												{#if !msg.is_read}
													<span class="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold uppercase">Baru</span>
												{/if}
											</div>
											{#if msg.subject}
												<p class="text-xs font-semibold text-primary">Subjek: {msg.subject}</p>
											{/if}
										</div>

										<div class="flex items-center gap-2">
											<span class="text-[11px] text-gray-400 flex items-center gap-1 mr-2">
												<Clock class="w-3.5 h-3.5" />
												{formatDate(msg.created_at)}
											</span>

											<form method="POST" action="?/toggleReadMessage" use:enhance>
												<input type="hidden" name="id" value={msg.id} />
												<input type="hidden" name="is_read" value={msg.is_read ? 'true' : 'false'} />
												<button
													type="submit"
													title={msg.is_read ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
													class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
												>
													{#if msg.is_read}
														<EyeOff class="w-4 h-4 text-gray-400" />
													{:else}
														<Eye class="w-4 h-4 text-emerald-400" />
													{/if}
												</button>
											</form>

											<a
												href="mailto:{msg.email}?subject=Re: {encodeURIComponent(msg.subject || 'Balasan Kontak Portofolio')}"
												target="_blank"
												title="Balas via Email"
												class="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary"
											>
												<Send class="w-4 h-4" />
											</a>

											<form method="POST" action="?/deleteMessage" use:enhance>
												<input type="hidden" name="id" value={msg.id} />
												<button
													type="submit"
													onclick={(e) => !confirm('Hapus pesan ini?') && e.preventDefault()}
													title="Hapus Pesan"
													class="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
												>
													<Trash2 class="w-4 h-4" />
												</button>
											</form>
										</div>
									</div>

									<div class="p-3.5 rounded-xl bg-black/30 border border-white/5 text-xs text-gray-200 whitespace-pre-line leading-relaxed">
										{msg.message}
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</main>
</div>

<!-- PROJECT MODAL -->
{#if showProjectModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
		<div class="w-full max-w-2xl bg-card-bg border border-white/10 rounded-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
			<h2 class="text-xl font-bold text-white">{editingProject ? 'Edit Project' : 'New Project'}</h2>
			<form
				method="POST"
				action="?/saveProject"
				enctype="multipart/form-data"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
						showProjectModal = false;
					};
				}}
				class="space-y-4 text-sm"
			>
				<input type="hidden" name="id" value={editingProject?.id || ''} />

				<div>
					<label for="project_title" class="block text-xs text-gray-400 mb-1">Title</label>
					<input id="project_title" type="text" name="title" value={editingProject?.title || ''} required class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none" />
				</div>

				<div>
					<label for="project_description" class="block text-xs text-gray-400 mb-1">Description</label>
					<textarea id="project_description" name="description" rows="3" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none">{editingProject?.description || ''}</textarea>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="thumbnail_file" class="block text-xs text-gray-400 mb-1">Thumbnail File</label>
						<input id="thumbnail_file" type="file" name="thumbnail_file" accept="image/*" class="w-full text-xs text-gray-400" />
						<input type="hidden" name="thumbnail_url" value={editingProject?.thumbnail_url || ''} />
					</div>

					<div>
						<label for="tech_stack" class="block text-xs text-gray-400 mb-1">Tech Stack (comma separated)</label>
						<input id="tech_stack" type="text" name="tech_stack" value={editingProject?.tech_stack?.join(', ') || ''} placeholder="Svelte, Tailwind, Supabase" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none" />
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="demo_url" class="block text-xs text-gray-400 mb-1">Demo URL</label>
						<input id="demo_url" type="url" name="demo_url" value={editingProject?.demo_url || ''} class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none" />
					</div>

					<div>
						<label for="repo_url" class="block text-xs text-gray-400 mb-1">Repository URL</label>
						<input id="repo_url" type="url" name="repo_url" value={editingProject?.repo_url || ''} class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none" />
					</div>
				</div>

				<div class="flex items-center gap-6 pt-2">
					<label class="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
						<input type="checkbox" name="is_featured" checked={editingProject?.is_featured || false} class="rounded border-white/10 bg-white/5 text-primary focus:ring-0" />
						<span>Featured Project</span>
					</label>

					<div class="flex items-center gap-2">
						<label for="project_display_order" class="text-xs text-gray-400">Display Order:</label>
						<input id="project_display_order" type="number" name="display_order" value={editingProject?.display_order || 0} class="w-20 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-xs" />
					</div>
				</div>

				<div class="flex justify-end gap-3 pt-4 border-t border-white/10">
					<button type="button" onclick={() => (showProjectModal = false)} class="px-4 py-2 rounded-xl border border-white/10 text-gray-300">Cancel</button>
					<button type="submit" disabled={loading} class="px-6 py-2 rounded-xl bg-primary text-white font-medium">{loading ? 'Saving...' : 'Save Project'}</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- SKILL MODAL -->
{#if showSkillModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
		<div class="w-full max-w-md bg-card-bg border border-white/10 rounded-2xl p-6 space-y-6">
			<h2 class="text-xl font-bold text-white">{editingSkill ? 'Edit Skill' : 'New Skill'}</h2>
			<form
				method="POST"
				action="?/saveSkill"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
						showSkillModal = false;
					};
				}}
				class="space-y-4 text-sm"
			>
				<input type="hidden" name="id" value={editingSkill?.id || ''} />

				<div>
					<label for="skill_name" class="block text-xs text-gray-400 mb-1">Skill Name</label>
					<input id="skill_name" type="text" name="name" value={editingSkill?.name || ''} required class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none" />
				</div>

				<div>
					<label for="skill_category" class="block text-xs text-gray-400 mb-1">Category</label>
					<select id="skill_category" name="category" value={editingSkill?.category || 'frontend'} class="w-full px-4 py-2 rounded-xl bg-card-bg border border-white/10 text-white focus:outline-none">
						<option value="frontend">Frontend</option>
						<option value="backend">Backend</option>
						<option value="mobile">Mobile</option>
						<option value="tools">Tools & DevOps</option>
						<option value="database">Database</option>
						<option value="other">Other</option>
					</select>
				</div>

				<div>
					<label for="proficiency_level" class="block text-xs text-gray-400 mb-1">Proficiency Level (1-5)</label>
					<input id="proficiency_level" type="number" min="1" max="5" name="proficiency_level" value={editingSkill?.proficiency_level || 3} class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none" />
				</div>

				<div>
					<label for="skill_display_order" class="block text-xs text-gray-400 mb-1">Display Order</label>
					<input id="skill_display_order" type="number" name="display_order" value={editingSkill?.display_order || 0} class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none" />
				</div>

				<div class="flex justify-end gap-3 pt-4 border-t border-white/10">
					<button type="button" onclick={() => (showSkillModal = false)} class="px-4 py-2 rounded-xl border border-white/10 text-gray-300">Cancel</button>
					<button type="submit" disabled={loading} class="px-6 py-2 rounded-xl bg-primary text-white font-medium">{loading ? 'Saving...' : 'Save Skill'}</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- EXPERIENCE MODAL -->
{#if showExperienceModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
		<div class="w-full max-w-lg bg-card-bg border border-white/10 rounded-2xl p-6 space-y-6">
			<h2 class="text-xl font-bold text-white">{editingExperience ? 'Edit Experience' : 'New Experience'}</h2>
			<form
				method="POST"
				action="?/saveExperience"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
						showExperienceModal = false;
					};
				}}
				class="space-y-4 text-sm"
			>
				<input type="hidden" name="id" value={editingExperience?.id || ''} />

				<div>
					<label for="role_title" class="block text-xs text-gray-400 mb-1">Role Title</label>
					<input id="role_title" type="text" name="role_title" value={editingExperience?.role_title || ''} required class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none" />
				</div>

				<div>
					<label for="organization" class="block text-xs text-gray-400 mb-1">Organization / Company</label>
					<input id="organization" type="text" name="organization" value={editingExperience?.organization || ''} required class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none" />
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="start_date" class="block text-xs text-gray-400 mb-1">Start Date</label>
						<input id="start_date" type="date" name="start_date" value={editingExperience?.start_date || ''} required class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none" />
					</div>

					<div>
						<label for="end_date" class="block text-xs text-gray-400 mb-1">End Date (Leave blank for "Present")</label>
						<input id="end_date" type="date" name="end_date" value={editingExperience?.end_date || ''} class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none" />
					</div>
				</div>

				<div>
					<label for="location" class="block text-xs text-gray-400 mb-1">Location</label>
					<input id="location" type="text" name="location" value={editingExperience?.location || ''} placeholder="Jakarta, Indonesia (Remote)" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none" />
				</div>

				<div>
					<label for="exp_description" class="block text-xs text-gray-400 mb-1">Description</label>
					<textarea id="exp_description" name="description" rows="3" class="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none">{editingExperience?.description || ''}</textarea>
				</div>

				<div class="flex justify-end gap-3 pt-4 border-t border-white/10">
					<button type="button" onclick={() => (showExperienceModal = false)} class="px-4 py-2 rounded-xl border border-white/10 text-gray-300">Cancel</button>
					<button type="submit" disabled={loading} class="px-6 py-2 rounded-xl bg-primary text-white font-medium">{loading ? 'Saving...' : 'Save Experience'}</button>
				</div>
			</form>
		</div>
	</div>
{/if}
