<script lang="ts">
	import { page } from '$app/state';
	import { ArrowLeft, Home, FileText, AlertTriangle } from 'lucide-svelte';
</script>

<svelte:head>
	<title>{page.status} | Terjadi Kesalahan</title>
</svelte:head>

<div class="relative flex min-h-[90vh] flex-col items-center justify-center px-6 py-20 text-center text-white selection:bg-blue-500/30 selection:text-white">
	<!-- Ambient Background Glow -->
	<div class="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/15 blur-[120px]"></div>
	<div class="pointer-events-none absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-[100px]"></div>

	<div class="relative z-10 max-w-lg mx-auto space-y-6">
		<!-- Icon Badge -->
		<div class="inline-flex items-center justify-center p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 shadow-xl backdrop-blur-md">
			<AlertTriangle class="w-8 h-8 text-amber-400" />
		</div>

		<!-- Status Code -->
		<div>
			<span class="font-mono text-7xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
				{page.status}
			</span>
		</div>

		<!-- Error Message & Description -->
		<div class="space-y-2">
			<h1 class="text-2xl md:text-3xl font-bold tracking-tight text-white">
				{page.status === 404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan Server'}
			</h1>
			<p class="text-sm md:text-base text-gray-400 font-mono leading-relaxed max-w-md mx-auto">
				{page.error?.message || (page.status === 404 ? 'Alamat URL yang Anda tuju tidak tersedia atau telah dipindahkan.' : 'Mohon maaf, sistem mengalami kendala saat memproses permintaan Anda.')}
			</p>
		</div>

		<!-- Action Buttons (Centered) -->
		<div class="flex flex-wrap items-center justify-center gap-3 pt-4">
			<a
				href="/"
				class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
			>
				<Home class="w-4 h-4" />
				Kembali ke Beranda
			</a>

			<a
				href="/cv"
				class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-mono text-xs font-bold transition-all active:scale-95"
			>
				<FileText class="w-4 h-4" />
				Lihat CV ATS
			</a>
		</div>
	</div>
</div>
