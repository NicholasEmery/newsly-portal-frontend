import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: ['**/node_modules/**', '**/.next/**', '**/coverage/**'],
    // Provide common globals used across the project (browser, node, test and tooling)
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        DOMParser: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        console: 'readonly',
      },
    },
  },
  // Disable core rules that conflict with TypeScript/browser globals
  {
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // TypeScript performs undef checks — disable ESLint's no-undef to avoid false positives
      'no-undef': 'off',
      // Use the TypeScript-aware rule for unused vars
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
      'import/no-unresolved': 'off',
      'no-console': 'warn',
    },
  },
  // Override for Cypress tests: provide test globals and cy/Cypress
  {
    files: ['cypress/**/*.ts', 'cypress/**/*.js', 'cypress/**/*.tsx', 'cypress/**/*.jsx'],
    languageOptions: {
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
  },
  // Allow console usage in scripts
  {
    files: ['scripts/**/*.js', 'scripts/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
];
