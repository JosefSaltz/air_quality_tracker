import deno from "@deno/vite-plugin";
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';
import { sentrySvelteKit } from "@sentry/sveltekit";

export default defineConfig({
	build: {
		assetsInlineLimit: 0
	},
	plugins: [
		deno(),
		sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: "piita",
        project: "javascript-sveltekit",
        authToken: process.env.SENTRY_AUTH_TOKEN,
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
});
