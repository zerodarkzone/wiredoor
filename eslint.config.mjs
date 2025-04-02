import js from '@eslint/js';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const tsParser = require('@typescript-eslint/parser');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default [
    {
        ignores: ['eslint.config.*js', 'node_modules', 'dist'],
    },
    js.configs.recommended,
    ...compat.extends(
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ),
    {
        files: ['src/**/*.ts', 'src/**/*.test.ts'],
        languageOptions: {
        parser: tsParser,
        parserOptions: {
            project: './tsconfig.eslint.json',
            tsconfigRootDir: __dirname,
            sourceType: 'module',
            ecmaVersion: 2020,
        },
        globals: {
            ...globals.node,
            ...globals.jest,
        },
        },
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin,
        },
        rules: {
            'no-useless-catch': 'off',
            '@typescript-eslint/explicit-member-accessibility': 0,
            '@typescript-eslint/no-parameter-properties': 0,
            '@typescript-eslint/interface-name-prefix': 0,
            '@typescript-eslint/explicit-function-return-type': 1,
            '@typescript-eslint/explicit-module-boundary-types': 0,
            '@typescript-eslint/no-explicit-any': 1,
        },
    },
];