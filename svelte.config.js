import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		csp: {
			"directives": {
				
			},
			"mode": "nonce"
		},
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