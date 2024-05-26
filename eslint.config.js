import pluginTypescript from "@typescript-eslint/eslint-plugin";
import parserTypescript from "@typescript-eslint/parser";
// @ts-expect-error Package has no types
import configPrettier from "eslint-config-prettier";
// @ts-expect-error Package has no types
import pluginImport from "eslint-plugin-import";
// @ts-expect-error Package has no types
import pluginReact from "eslint-plugin-react";
// @ts-expect-error Package has no types
import pluginReactHooks from "eslint-plugin-react-hooks";
// @ts-expect-error Package has no types
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";

/**
 * Get an ESLint config for a project, in "FlatConfig" format.
 *
 * @param {{ react?: boolean, remix?: boolean }} [options]
 */
export function configure(options) {
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
      // @ts-expect-error `parserTypescript` type not perfect match
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
      // @ts-expect-error `pluginTypescript` type not perfect match
      "@typescript-eslint": pluginTypescript,
      "simple-import-sort": pluginSimpleImportSort,
      import: pluginImport,
    },
    rules: {
      // TypeScript
      ...pluginTypescript.configs.recommended.rules,

      // Prettier
      ...configPrettier.rules,

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
  // Allow default exports in some files.
  {
    files: [
      // Config
      "**/*.config.ts",
      "**/*.config.js",
      // Type definitions
      "**/*.d.ts",
      // Storybook stories
      "**/*.stories.tsx?",
      "**/*.stories.jsx?",
    ],
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
    files: [
      "**/app/routes/**/*.tsx",
      "**/app/routes/**/*.jsx",
      "**/app/entry.server.tsx",
      "**/app/root.tsx",
    ],
    rules: { "import/no-default-export": "off" },
  },
];

/**
 * ESLint configuration.
 *
 * Exported as an array from this file so it functions as a normal eslint config
 * file, so we get instant feedback in VSCode upon saving changes in this project.
 */
const defaultConfig = [
  {
    ignores: ["**/dist/**"],
  },
  ...configure({ react: true, remix: true }),
];

export default defaultConfig;
