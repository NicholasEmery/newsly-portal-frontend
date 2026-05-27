import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/coverage/**",
      "**/out/**",
      "**/build/**",
      "**/next-env.d.ts",
      "public/**",
    ],
  },
  {
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        DOMParser: "readonly",
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        console: "readonly",
      },
    },
  },
  {
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],
      "import/no-unresolved": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        vi: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
  },
  {
    files: ["cypress/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        cy: "readonly",
        Cypress: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
  },
  {
    files: ["scripts/**/*.js", "scripts/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
];
