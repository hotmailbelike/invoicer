import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Flat config replaces a rule's options wholesale for later-matching blocks instead of
// merging them, so each layer block below repeats every restriction that applies to it.
const pdfRuntime = {
  group: ['@react-pdf/*', '@/pdf', '@/pdf/**', '**/pdf', '**/pdf/**'],
  allowTypeImports: true,
  message:
    'Only src/features/preview/loadPdfRenderer.ts may load the PDF runtime. A value import anywhere else pulls @react-pdf into the entry chunk.',
};

const appLayers = {
  group: [
    '@/state',
    '@/state/**',
    '**/state',
    '**/state/**',
    '@/features',
    '@/features/**',
    '**/features',
    '**/features/**',
    '@/app',
    '@/app/**',
    '**/app',
    '**/app/**',
  ],
  message: 'This layer must stay renderable from plain values, without React state or UI code.',
};

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{js,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/pdf/**', 'src/features/preview/loadPdfRenderer.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': ['error', { patterns: [pdfRuntime] }],
    },
  },
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react', 'react/*', 'react-dom', 'react-dom/*', '*.css'],
              message: 'src/domain is pure TypeScript: no React and no CSS.',
            },
            { ...pdfRuntime, allowTypeImports: false },
            appLayers,
          ],
        },
      ],
    },
  },
  {
    files: ['src/pdf/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-restricted-imports': ['error', { patterns: [appLayers] }],
    },
  },
]);
