import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			"@": "./src",
			"$root": "./",
			"$components": "./src/lib/components",
			"$routes": "./src/routes"
		},
		csp: {
			mode: "auto",
			directives: {
				"script-src": ["'self'", "localhost", "https://google.com", "https://youtube.com"],
				"img-src": ["'self'", "data:", "https://tile.openstreetmap.org", "https://images.unsplash.com", "https://*.googleusercontent.com"],
				"style-src": ["'self'", "localhost", "https://images.unsplash.com", "https://unpkg.com", "unsafe-inline", "data:", "blob:"],
			}
		}
	}
};

export default config;