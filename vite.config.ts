import deno from "@deno/vite-plugin";
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig, loadEnv } from 'vite';
import { sentrySvelteKit } from "@sentry/sveltekit";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	!env.SENTRY_AUTH_TOKEN && console.error(`SENTRY AUTH TOKEN NOT SET!`)
	return ({
		build: {
		assetsInlineLimit: 0
		},
		plugins: [
			deno(),
			sentrySvelteKit({
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
			}),
			sveltekit(),
			enhancedImages(),
		],
		resolve: {
			alias: {
				"zlib": "node:zlib"
			}
		},
		server: {
			port: 3000
		}
	})
});
