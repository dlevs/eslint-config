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

/**
 * @param {{ react?: boolean, remix?: boolean, ignores?: string[] }} [options]
 */
function configure(options) {
  const configs = [javascriptRules, typescriptRules];

  if (options?.react) {
    configs.push(reactRules);
  }

  if (options?.remix) {
    configs.push(remixRules);
  }

  if (options?.ignores) {
    configs.forEach((config) => {
      config.ignores = options.ignores;
    });
  }

  return configs;
}

/**
 * Language and plugin options used by most rules.
 *
 * @type {Partial<import("eslint").Linter.FlatConfig>}
 */
const sharedConfig = {
  languageOptions: {
    parser: parserTypescript,
    parserOptions: {
      // These options are necessary for some rules to work,
      // like "import/no-default-export".
      sourceType: "module",
      ecmaVersion: "latest",
    },
  },
  plugins: {
    "@typescript-eslint": pluginTypescript,
    "simple-import-sort": pluginSimpleImportSort,
    import: pluginImport,
    prettier: pluginPrettier,
  },
};

/**
 * Rules for all JavaScript / TypeScript files.
 * @type {import("eslint").Linter.FlatConfig}
 */
const javascriptRules = {
  ...sharedConfig,
  files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx", "**/*.json"],
  rules: {
    // Prettier
    ...configPrettier.rules,
    ...pluginPrettier.configs.recommended.rules,

    // Sort imports / exports
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",

    ...pluginImport.configs.recommended.rules,
    // // General import / export rules
    // // TODO: Check why this is no longer working. Maybe the latest version of eslint broke it?
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
  },
};

/**
 * Rules TypeScript files only.
 * @type {import("eslint").Linter.FlatConfig}
 */
const typescriptRules = {
  ...sharedConfig,
  files: ["**/*.ts", "**/*.tsx"],
  rules: pluginTypescript.configs.recommended.rules,
};

/**
 * Rules React projects.
 * @type {import("eslint").Linter.FlatConfig}
 */
const reactRules = {
  ...sharedConfig,
  files: ["**/*.jsx", "**/*.tsx"],
  plugins: {
    react: pluginReact,
    reactHooks: pluginReactHooks,
  },
  rules: {
    ...pluginReact.configs.recommended.rules,
    "react/react-in-jsx-scope": "off",
    // Prop types not needed with TypeScript.
    "react/prop-types": "off",
  },
  settings: { react: { version: "detect" } },
};

/**
 * Rules Remix projects.
 * @type {import("eslint").Linter.FlatConfig}
 */
const remixRules = {
  ...sharedConfig,
  files: ["**/app/routes/**/*.tsx", "**/app/routes/**/*.jsx"],
  rules: {
    // Remix requires the use of default exports for routes.
    "import/no-default-export": "off",
  },
};

/**
 * ESLint configuration.
 *
 * Exported as an array from this file so it functions as a normal eslint config
 * file, so we get instant feedback in VSCode upon saving changes.
 *
 * It also has a "configure" method that is intended to be used by package
 * consumers.
 *
 * Ideally, we'd use ESM to make a default export and a named export, but ESLint
 * doesn't support that yet.
 */
const defaultConfig = Object.assign(
  configure({
    react: true,
    remix: true,
    ignores: ["dist/**"],
  }),
  { configure }
);

module.exports = defaultConfig;
