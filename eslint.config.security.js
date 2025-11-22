const security = require("eslint-plugin-security");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			security,
			"@typescript-eslint": tseslint,
		},
		rules: {
			...security.configs.recommended.rules,
			"security/detect-object-injection": "warn",
			"security/detect-non-literal-regexp": "warn",
			"security/detect-non-literal-fs-filename": "warn",
			"security/detect-eval-with-expression": "error",
			"security/detect-pseudoRandomBytes": "warn",
			"security/detect-possible-timing-attacks": "warn",
			"security/detect-unsafe-regex": "error",
			"security/detect-buffer-noassert": "error",
			"security/detect-child-process": "warn",
			"security/detect-disable-mustache-escape": "error",
			"security/detect-new-buffer": "warn",
			"security/detect-no-csrf-before-method-override": "error",
			"security/detect-non-literal-require": "warn",
			"security/detect-optional-chaining": "off",
		},
	},
	{
		ignores: [
			"node_modules/**",
			".next/**",
			"dist/**",
			"build/**",
			"*.config.js",
			"*.config.ts",
		],
	},
];
