<script lang="ts">
	import { Printer, ArrowLeft, Loader2 } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { SkillSection } from '$lib/supabase/types';

	let { data } = $props();
	let isPreparingPdf = $state(false);

	function handlePrint() {
		if (typeof window !== 'undefined') {
			window.print();
		}
	}

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('view') === 'pdf') {
			isPreparingPdf = true;
			setTimeout(() => {
				isPreparingPdf = false;
				window.print();
			}, 400);
		}
	});

	// Group skills by category for ATS layout (clean text list without scores/ranges)
	const groupedSkills = $derived.by(() => {
		const groups: Record<string, string[]> = {};
		data.skills.forEach((s: SkillSection) => {
			const cat = s.category || 'Other';
			if (!groups[cat]) groups[cat] = [];
			groups[cat].push(s.name);
		});
		return groups;
	});
</script>

<svelte:head>
	<title>{data.home.full_name} - ATS Resume / CV</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<!-- Action Header Bar (hidden in print) -->
<header class="no-print sticky top-0 z-50 bg-[#0f1117]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 shadow-lg font-sans">
	<div class="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
		<a
			href="/"
			class="inline-flex items-center gap-2 text-xs font-mono font-medium text-gray-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
		>
			<ArrowLeft class="w-3.5 h-3.5" />
			Back to Portfolio
		</a>

		<div class="flex items-center gap-3">
			<button
				onclick={handlePrint}
				class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-all shadow-md hover:shadow-blue-500/30 active:scale-95"
			>
				<Printer class="w-4 h-4" />
				Download / Print PDF
			</button>
		</div>
	</div>
</header>

{#if isPreparingPdf}
	<div class="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
		<div class="flex items-center gap-3 px-5 py-3 rounded-2xl bg-zinc-900 border border-white/15 text-white font-mono text-sm shadow-2xl">
			<Loader2 class="w-5 h-5 text-blue-400 animate-spin" />
			<span>Memuat Tampilan PDF...</span>
		</div>
	</div>
{/if}

<!-- Document Container -->
<div class="bg-zinc-200 min-h-screen py-8 px-4 sm:px-6 print:p-0 print:bg-white print:min-h-0 text-black">
	<article
		id="cv-document"
		class="max-w-4xl mx-auto bg-white p-8 sm:p-12 md:p-16 rounded-xl shadow-2xl print:shadow-none print:p-0 print:max-w-none print:rounded-none text-[13px] leading-relaxed text-zinc-900"
	>
		<!-- HEADER (No phone number, single font Arial) -->
		<header class="text-center border-b border-zinc-300 pb-3 mb-5">
			<h1 class="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-zinc-950 mb-1">
				{data.home.full_name}
			</h1>

			<p class="text-xs sm:text-[13px] text-zinc-700 font-medium">
				{data.home.location || 'Jember, East Java'}
			</p>

			<p class="text-xs sm:text-[13px] text-zinc-700 mt-1">
				{#if data.home.contact_email}
					<a href="mailto:{data.home.contact_email}" class="text-blue-700 hover:underline">
						{data.home.contact_email}
					</a>
					<span class="mx-1 text-zinc-400">|</span>
				{/if}
				{#if data.home.social_links?.linkedin}
					<a href={data.home.social_links.linkedin} target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:underline">
						LinkedIn
					</a>
					<span class="mx-1 text-zinc-400">|</span>
				{/if}
				{#if data.home.social_links?.github}
					<a href={data.home.social_links.github} target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:underline">
						Github
					</a>
				{/if}
			</p>
		</header>

		<!-- SUMMARY -->
		{#if data.home.bio}
			<section class="mb-5">
				<h2 class="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-1 mb-2">
					Summary
				</h2>
				<p class="text-zinc-800 text-justify text-xs sm:text-[13px] leading-normal">
					{data.home.bio}
				</p>
			</section>
		{/if}

		<!-- PROJECT EXPERIENCE -->
		{#if data.projects && data.projects.length > 0}
			<section class="mb-5">
				<h2 class="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-1 mb-2.5">
					Project Experience
				</h2>

				<div class="space-y-4">
					{#each data.projects as project}
						<div>
							<div class="flex flex-wrap items-baseline justify-between gap-1">
								<div>
									<span class="font-bold text-zinc-950 text-xs sm:text-[13px]">
										{project.title}{project.subtitle ? `, ${project.subtitle}` : ''}
									</span>
									{#if project.repo_url}
										<span class="ml-1 text-xs">
											[<a href={project.repo_url} target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:underline">project link</a>]
										</span>
									{:else if project.repo_type === 'private'}
										<span class="ml-1 text-xs text-zinc-500 italic">
											[private project]
										</span>
									{/if}
								</div>

								{#if project.period}
									<span class="text-xs font-medium text-zinc-700 shrink-0">
										{project.period}
									</span>
								{/if}
							</div>

							{#if project.role}
								<div class="text-xs italic text-zinc-700 mb-1">
									{project.role}
								</div>
							{/if}

							{#if project.bullet_points && project.bullet_points.length > 0}
								<ul class="list-disc list-outside ml-4 space-y-0.5 text-xs sm:text-[12.5px] text-zinc-800">
									{#each project.bullet_points as bullet}
										<li>{bullet}</li>
									{/each}
								</ul>
							{:else if project.description}
								<p class="text-xs sm:text-[12.5px] text-zinc-800">
									{project.description}
								</p>
							{/if}

							{#if project.tech_stack && project.tech_stack.length > 0}
								<p class="text-xs text-zinc-800 mt-1">
									<strong class="font-semibold text-zinc-950">Tech used:</strong> {project.tech_stack.join(', ')}.
								</p>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- WORKING EXPERIENCE -->
		{#if data.experiences && data.experiences.length > 0}
			<section class="mb-5">
				<h2 class="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-1 mb-2.5">
					Working Experience
				</h2>

				<div class="space-y-4">
					{#each data.experiences as exp}
						<div>
							<div class="flex flex-wrap items-baseline justify-between gap-1">
								<span class="font-bold text-zinc-950 text-xs sm:text-[13px]">
									{exp.organization}{exp.location ? `, ${exp.location}` : ''}
								</span>
								<span class="text-xs font-medium text-zinc-700 shrink-0">
									{exp.period_text || (exp.start_date + ' – ' + (exp.end_date || 'Present'))}
								</span>
							</div>

							<div class="text-xs italic text-zinc-700 mb-1">
								{exp.role_title}
							</div>

							{#if exp.bullet_points && exp.bullet_points.length > 0}
								<ul class="list-disc list-outside ml-4 space-y-0.5 text-xs sm:text-[12.5px] text-zinc-800">
									{#each exp.bullet_points as bullet}
										<li>{bullet}</li>
									{/each}
								</ul>
							{:else if exp.description}
								<p class="text-xs sm:text-[12.5px] text-zinc-800">
									{exp.description}
								</p>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- EDUCATION -->
		{#if data.educations && data.educations.length > 0}
			<section class="mb-5">
				<h2 class="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-1 mb-2.5">
					Education
				</h2>

				<div class="space-y-3">
					{#each data.educations as edu}
						<div>
							<div class="flex flex-wrap items-baseline justify-between gap-1">
								<span class="font-bold text-zinc-950 text-xs sm:text-[13px]">
									{edu.institution}
								</span>
								<span class="text-xs font-medium text-zinc-700 shrink-0">
									{edu.start_date} – {edu.end_date || 'Present'}
								</span>
							</div>

							<div class="text-xs italic text-zinc-700">
								{edu.degree}
							</div>

							{#if edu.gpa}
								<div class="text-xs text-zinc-800 mt-0.5">
									<strong class="font-semibold text-zinc-950">GPA:</strong> {edu.gpa}
								</div>
							{/if}

							{#if edu.coursework}
								<div class="text-xs text-zinc-800 mt-0.5">
									<strong class="font-semibold text-zinc-950">Relevant coursework:</strong> {edu.coursework}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- ACHIEVEMENTS -->
		{#if data.achievements && data.achievements.length > 0}
			<section class="mb-5">
				<h2 class="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-1 mb-2.5">
					Achievements
				</h2>

				<div class="space-y-3">
					{#each data.achievements as ach}
						<div>
							<div class="flex flex-wrap items-baseline justify-between gap-1">
								<span class="font-bold text-zinc-950 text-xs sm:text-[13px]">
									{ach.title}
								</span>
								{#if ach.period}
									<span class="text-xs font-medium text-zinc-700 shrink-0">
										{ach.period}
									</span>
								{/if}
							</div>

							{#if ach.description}
								<p class="text-xs text-zinc-800 mt-0.5">
									{ach.description}
								</p>
							{/if}

							{#if ach.certificate_url}
								<p class="text-xs text-zinc-800 mt-0.5">
									Certification: <a href={ach.certificate_url} target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:underline">E-sertifikat</a>
								</p>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- TOOLS & SKILLS (Clean categorized text list without ranges/scores) -->
		{#if Object.keys(groupedSkills).length > 0}
			<section class="mb-4">
				<h2 class="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-1 mb-2.5">
					Tools & Skills
				</h2>

				<div class="space-y-1 text-xs sm:text-[12.5px] text-zinc-800">
					{#each Object.entries(groupedSkills) as [category, items]}
						<p>
							<strong class="font-semibold text-zinc-950">{category}:</strong> {items.join(', ')}.
						</p>
					{/each}
				</div>
			</section>
		{/if}
	</article>
</div>

<style>
	/* Use 1 single font (Arial) strictly throughout the document */
	#cv-document,
	#cv-document :global(*) {
		font-family: Arial, Helvetica, sans-serif !important;
	}

	@media print {
		.no-print {
			display: none !important;
		}

		:global(body) {
			background-color: #fff !important;
			color: #000 !important;
			font-family: Arial, Helvetica, sans-serif !important;
		}

		@page {
			size: A4 portrait;
			margin: 12mm 15mm;
		}

		#cv-document {
			box-shadow: none !important;
			padding: 0 !important;
			margin: 0 !important;
			max-width: 100% !important;
			width: 100% !important;
			font-family: Arial, Helvetica, sans-serif !important;
		}

		#cv-document :global(*) {
			font-family: Arial, Helvetica, sans-serif !important;
		}

		a {
			text-decoration: none !important;
			color: #000 !important;
		}
	}
</style>
