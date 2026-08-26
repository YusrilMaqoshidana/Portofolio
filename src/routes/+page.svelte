<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import HomeSection from '$lib/components/sections/HomeSection.svelte';
	import ProjectSection from '$lib/components/sections/ProjectSection.svelte';
	import SkillSection from '$lib/components/sections/SkillSection.svelte';
	import ExperienceSection from '$lib/components/sections/ExperienceSection.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.home?.full_name ? `${data.home.full_name} | Portfolio` : 'Portfolio'}</title>
	<meta name="description" content={data.home?.bio || 'Personal Portfolio and Showcase'} />
</svelte:head>

<div class="min-h-screen bg-background-dark text-white selection:bg-primary selection:text-white">
	<Navbar />

	<main>
		<HomeSection data={data.home} />
		<ProjectSection projects={data.projects} />
		<SkillSection skills={data.skills} />
		<ExperienceSection experiences={data.experiences} />
	</main>

	<Footer />
</div>
