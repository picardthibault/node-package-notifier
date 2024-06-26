const tseslint = require('typescript-eslint');
const eslint = require('@eslint/js');
const eslintPrettierPlugin = require('eslint-plugin-prettier');
const globals = require('globals');

module.exports = tseslint.config({
    files: ["**/*.ts", "**/*.tsx"],
    ignores: [
        "**/webpack.main.config.ts",
        "**/webpack.plugins.ts",
        "**/webpack.renderer.config.ts",
        "**/webpack.rules.ts",
        "**/forge.config.ts",
    ],
    plugins: {
        '@typescript-eslint': tseslint.plugin,
        prettier: eslintPrettierPlugin,
        eslint: eslint,
    },
    languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
            project: true,
        },
        sourceType: 'commonjs',
        globals: {
            ...globals.browser,
            ...globals.node,
            ...globals.es2021,
        }
    },
    settings: {
        'import/resolver': {
            typescript: true,
      },
    },
    rules: {
        ...eslint.configs.recommended.rules,
        ...tseslint.configs.recommendedTypeChecked.rules,
        ...tseslint.configs.strictTypeChecked.rules,
        ...tseslint.configs.stylisticTypeChecked.rules,
        ...eslintPrettierPlugin.configs.recommended.rules,
        "@typescript-eslint/restrict-template-expressions": [
            "error",
            {
                allowAny: false,
                allowBoolean: false,
                allowNullish: true,
                allowNumber: true,
                allowRegExp: false,
                allowNever: false
            }
        ],
        "@typescript-eslint/no-unused-vars": "error",
        // Disable the following rules because they are covered by a typescript alternative (compiler or @typescript-eslint)
        "no-redeclare": "off",
        "no-undef": "off",
        "no-unused-vars": "off",
    },
});
