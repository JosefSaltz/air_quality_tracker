import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	compilerOptions: {
		experimental: {
			async: true
		}
	},
	kit: {
		adapter: adapter(),
		alias: {
			"@": "./src",
			"$root": "./",
			"$components": "./src/lib/components",
			"$routes": "./src/routes",
			"$zSchemas": "./src/lib/utils/zSchemas"
		},
		csp: {
			mode: "auto",
			directives: {
				"script-src": [
					"'self'",
					"localhost",
					"https://challenges.cloudflare.com",
					"https://challenges.cloudflare.com/turnstile/v0/api.js",
					"https://accounts.google.com",
					"https://youtube.com",
					"sha256-y2WkUILyE4eycy7x+pC0z99aZjTZlWfVwgUAfNc1sY8=",
					"blob:"
				],
				"img-src": [
					"'self'",
					"data:",
					"https://tile.openstreetmap.org",
					"https://images.unsplash.com",
					"https://lh3.googleusercontent.com"
				],
				"style-src": [
					"'self'", 
					"localhost",
					"https://cdn.jsdelivr.net", 
					"https://images.unsplash.com", 
					"https://unpkg.com", 
					"unsafe-inline",
					"data:",
					"blob:"
					],
				"connect-src": [
					"'self'",
					"http://localhost:54321", 
					"https://*.sentry.io", 
					"https://ryyejiiqfbqodsqjexdj.supabase.co",
					"https://challenges.cloudflare.com"
				]
			}
		}
	}
};

export default config;