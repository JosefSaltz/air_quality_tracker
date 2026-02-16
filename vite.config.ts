import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig, loadEnv } from 'vite';
import { sentrySvelteKit } from "@sentry/sveltekit";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
 	if(!env.SENTRY_AUTH_TOKEN) throw new Error(`SENTRY AUTH TOKEN NOT SET!`);
	
	const sentryConfig = {
		sourceMapsUploadOptions: {
			org: "piita",
			project: "javascript-sveltekit",
			authToken: env.SENTRY_AUTH_TOKEN,
			sourcemaps: {
				assets: ["./build/*/**/*"],
				ignore: ["**/build/client/**/*"],
				filesToDeleteAfterUpload: ["./build/**/*.map"],
			},
		},
	}

	return ({
		build: {
			assetsInlineLimit: 0
		},
		plugins: [
			enhancedImages(),
			tailwindcss(),
			sentrySvelteKit(sentryConfig),
			sveltekit()
		],
		server: {
			port: 3000,
			allowedHosts: [
				"jsysd-wsl"
			]
		}
	})
});
