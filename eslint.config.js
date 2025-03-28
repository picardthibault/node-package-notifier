import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default tseslint.config(
  {
    ignores: [
      '.vite/**',
      'forge.config.cts',
      'eslint.config.js',
      'jest.config.js',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.ts'],
          defaultProject: 'tsconfig.json',
        },
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
  },
  {
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { caughtErrors: 'none' }],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowAny: false,
          allowBoolean: false,
          allowNullish: true,
          allowNumber: true,
          allowRegExp: false,
          allowNever: false,
        },
      ],
    },
  },
  
  {
    // Disable typescript eslint rules on js files
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
