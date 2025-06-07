// @ts-check

//-- NPM Packages
import globals from 'globals';
import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['*.js', '*.cjs', '*.mjs']
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            globals: {
                Deno: 'readonly',
                ...globals.es2022
            },
            parserOptions: {
                projectService: true
            }
        }
    },
    {
        files: ['**/tests/*.ts', '**/tests/**/*.ts'],
        rules: {
            '@typescript-eslint/no-unused-expressions': 'off'
        }
    },
    prettierConfig
);
