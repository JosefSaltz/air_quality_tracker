import deno from "@deno/vite-plugin";
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit() ,
		enhancedImages(),
		deno()
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
