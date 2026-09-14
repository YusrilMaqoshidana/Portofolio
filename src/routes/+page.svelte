<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import HomeSection from '$lib/components/sections/HomeSection.svelte';
	import ProjectSection from '$lib/components/sections/ProjectSection.svelte';
	import SkillSection from '$lib/components/sections/SkillSection.svelte';
	import ExperienceSection from '$lib/components/sections/ExperienceSection.svelte';
	import ContactSection from '$lib/components/sections/ContactSection.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>{data.home?.full_name ? `${data.home.full_name} | Portfolio` : 'Portfolio'}</title>
	<meta name="description" content={data.home?.bio || 'Personal Portfolio and Showcase'} />
</svelte:head>

<div class="min-h-screen bg-background-dark text-white selection:bg-primary selection:text-white">
	<Navbar brandName={data.home?.full_name ? data.home.full_name.split(' ')[0] : 'Yusril'} resumeLink={data.home?.resume_url || '#'} />

	<main>
		<HomeSection data={data.home} />
		<SkillSection skills={data.skills} />
		<ExperienceSection experiences={data.experiences} />
		<ProjectSection projects={data.projects} />
		<ContactSection contactEmail={data.home?.contact_email} socialLinks={data.home?.social_links} />
	</main>

	<Footer />
</div>
