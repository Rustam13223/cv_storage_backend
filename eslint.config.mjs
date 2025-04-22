import js from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        plugins: { js, prettier: eslintPluginPrettier },
        extends: ['js/recommended'],
    },
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        languageOptions: { globals: globals.browser, parser: tseslint.parser },
        rules: {
            'prettier/prettier': 'error',
        },
    },
    tseslint.configs.recommended,
]);
