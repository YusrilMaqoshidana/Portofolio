// Svelte action: fade + translateY reveal on scroll
// Usage: <div use:reveal> or <div use:reveal={{ delay: 200 }}>

interface RevealOptions {
	delay?: number;
	threshold?: number;
	once?: boolean;
}

export function reveal(node: HTMLElement, options: RevealOptions = {}) {
	const { delay = 0, threshold = 0.15, once = true } = options;

	// Initial hidden state
	node.style.opacity = '0';
	node.style.transform = 'translateY(20px)';
	node.style.transition = `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;

	// Respect prefers-reduced-motion
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.style.opacity = '1';
		node.style.transform = 'none';
		node.style.transition = 'none';
		return {};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					node.style.opacity = '1';
					node.style.transform = 'translateY(0)';
					if (once) observer.unobserve(node);
				} else if (!once) {
					node.style.opacity = '0';
					node.style.transform = 'translateY(20px)';
				}
			});
		},
		{ threshold, rootMargin: '0px 0px -40px 0px' }
	);

	observer.observe(node);

	return {
		destroy() { observer.disconnect(); }
	};
}
