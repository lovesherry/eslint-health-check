import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import globals from 'globals';
import PrettierPlugin from 'eslint-plugin-prettier';
import PrettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
    },
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      ...tsPlugin.configs['recommended-requiring-type-checking'].rules,
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    plugins: {
      prettier: PrettierPlugin,
    },
    rules: {
      ...PrettierConfig.rules,
      'prettier/prettier': 'error',
    },
  },
];
