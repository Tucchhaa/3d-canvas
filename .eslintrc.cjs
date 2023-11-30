const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	plugins: ['@typescript-eslint', 'simple-import-sort'],
	parserOptions: {
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	rules: {
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
	},
});
