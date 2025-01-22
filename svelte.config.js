import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { compile } from 'svelte/compiler';

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
		}
	}
};

export default config;