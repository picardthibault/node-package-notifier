const tseslint = require('typescript-eslint');
const eslint = require('@eslint/js');
const globals = require('globals');

module.exports = tseslint.config(
  {
    ignores: [
      '.webpack/**',
      'webpack.main.config.ts',
      'webpack.plugins.ts',
      'webpack.renderer.config.ts',
      'webpack.rules.ts',
      'eslint.config.js',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.ts'],
          defaultProject: 'tsconfig.json',
        },
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    rules: {
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
