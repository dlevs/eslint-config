/* eslint-disable @typescript-eslint/no-var-requires */

/** @type {any} */
const parserTypescript = require("@typescript-eslint/parser");
/** @type {any} */
const pluginTypescript = require("@typescript-eslint/eslint-plugin");
// @ts-expect-error Package has no types
const pluginSimpleImportSort = require("eslint-plugin-simple-import-sort");
// @ts-expect-error Package has no types
const pluginImport = require("eslint-plugin-import");
// @ts-expect-error Package has no types
const pluginReact = require("eslint-plugin-react");
// @ts-expect-error Package has no types
const pluginReactHooks = require("eslint-plugin-react-hooks");
// @ts-expect-error Package has no types
const pluginPrettier = require("eslint-plugin-prettier");
// @ts-expect-error Package has no types
const configPrettier = require("eslint-config-prettier");

// TODO: Explore other best practices / common plugins. E.g. jsx-a11y, unicorn, etc.

/**
 * Get an ESLint config for a project, in "FlatConfig" format.
 *
 * @param {{ react?: boolean, remix?: boolean }} [options]
 */
function configure(options) {
  const configs = [...baseRules];

  if (options?.react) {
    configs.push(...reactRules);
  }

  if (options?.remix) {
    configs.push(...remixRules);
  }

  return configs;
}

/**
 * Rules for all JavaScript / TypeScript files.
 * @type {import("eslint").Linter.FlatConfig[]}
 */
const baseRules = [
  {
    languageOptions: {
      parser: parserTypescript,
      parserOptions: {
        // These options are necessary for some rules to work,
        // like "import/no-default-export".
        sourceType: "module",
        ecmaVersion: "latest",
      },
    },
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx", "**/*.json"],
    plugins: {
      "@typescript-eslint": pluginTypescript,
      "simple-import-sort": pluginSimpleImportSort,
      import: pluginImport,
      prettier: pluginPrettier,
    },
    rules: {
      // TypeScript
      ...pluginTypescript.configs.recommended.rules,

      // Prettier
      ...configPrettier.rules,
      ...pluginPrettier.configs.recommended.rules,

      // Sort imports / exports
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // General import / export rules
      ...pluginImport.configs.recommended.rules,
      "import/prefer-default-export": "off",
      "import/no-default-export": "error",
      // The following are not necessary with TypeScript.
      "import/named": "off",
      "import/namespace": "off",
      "import/no-unresolved": "off",
    },
    settings: {
      ...pluginImport.configs.typescript.settings,
      "import/parsers": {
        // Use espree for JS files to fix an issue documented here:
        // https://github.com/import-js/eslint-plugin-import/issues/2556#issuecomment-1555998681
        espree: [".js", ".jsx"],
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
    },
  },
  // Allow default exports in config files.
  {
    files: ["**/*.config.ts", "**/*.config.js"],
    rules: { "import/no-default-export": "off" },
  },
];

/**
 * Rules for React projects.
 * @type {import("eslint").Linter.FlatConfig[]}
 */
const reactRules = [
  {
    files: ["**/*.jsx", "**/*.tsx"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      // Prop types not needed with TypeScript.
      "react/prop-types": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },
];

/**
 * Rules for Remix projects.
 * @type {import("eslint").Linter.FlatConfig[]}
 */
const remixRules = [
  // Remix requires the use of default exports for routes.
  {
    files: ["**/app/routes/**/*.tsx", "**/app/routes/**/*.jsx"],
    rules: { "import/no-default-export": "off" },
  },
];

/**
 * ESLint configuration.
 *
 * Exported as an array from this file so it functions as a normal eslint config
 * file, so we get instant feedback in VSCode upon saving changes in this project.
 *
 * It also has a "configure" method that is intended to be used by package
 * consumers.
 *
 * Ideally, we'd use ESM to make a default export and a named export, but ESLint
 * doesn't support that yet.
 */
const defaultConfig = Object.assign(
  [
    {
      ignores: ["**/dist/**"],
    },
    ...configure({ react: true, remix: true }),
  ],
  { configure }
);

module.exports = defaultConfig;
