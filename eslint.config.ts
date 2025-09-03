import prettier from 'eslint-config-prettier';
import { includeIgnoreFile } from '@eslint/compat';
import css from "@eslint/css";
import json from "@eslint/json";
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	css.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	json.configs.recommended,
	prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node // Add this if you are using SvelteKit in non-SPA mode
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				// We recommend importing and specifying svelte.config.js.
				// By doing so, some rules in eslint-plugin-svelte will automatically read the configuration and adjust their behavior accordingly.
				// While certain Svelte settings may be statically loaded from svelte.config.js even if you don’t specify it,
				// explicitly specifying it ensures better compatibility and functionality.
				svelteConfig
			}
		}
	},
	{
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					"argsIgnorePattern": "^_",
					"varsIgnorePattern": "^\\$\\$(Props|Events|Slots|Generic)$"
				}
			]
		},
	}
)