<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import HomeSection from '$lib/components/sections/HomeSection.svelte';
	import EducationSection from '$lib/components/sections/EducationSection.svelte';
	import ExperienceSection from '$lib/components/sections/ExperienceSection.svelte';
	import ProjectSection from '$lib/components/sections/ProjectSection.svelte';
	import SkillSection from '$lib/components/sections/SkillSection.svelte';
	import AchievementSection from '$lib/components/sections/AchievementSection.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>{data.home?.full_name ? `${data.home.full_name} | Mobile Developer Portfolio` : 'Moh. Yusril Maqoshidana | Portfolio'}</title>
	<meta name="description" content={data.home?.bio || 'Mobile Developer & Android Engineer Portfolio'} />
</svelte:head>

<div class="min-h-screen bg-background-dark text-white selection:bg-primary selection:text-white">
	<Navbar
		brandName={data.home?.full_name ? data.home.full_name.split(' ')[0] : 'Yusril'}
		resumeLink="/cv"
	/>

	<main>
		<HomeSection data={data.home} />
		<EducationSection educations={data.educations} />
		<ExperienceSection experiences={data.experiences} />
		<ProjectSection projects={data.projects} />
		<SkillSection skills={data.skills} />
		<AchievementSection achievements={data.achievements} />
	</main>

	<Footer />
</div>
