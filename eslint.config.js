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
  const configs = [typeScriptRules, typeJavaScriptRules];

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
 * Rules TypeScript files only.
 * @type {import("eslint").Linter.FlatConfig}
 */
const typeScriptRules = {
  files: ["**/*.ts", "**/*.tsx"],
  languageOptions: { parser: parserTypescript },
  plugins: { "@typescript-eslint": pluginTypescript },
  rules: pluginTypescript.configs.recommended.rules,
};

/**
 * Rules for all JavaScript / TypeScript files.
 * @type {import("eslint").Linter.FlatConfig}
 */
const typeJavaScriptRules = {
  files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx", "**/*.json"],
  languageOptions: { parser: parserTypescript },
  plugins: {
    "simple-import-sort": pluginSimpleImportSort,
    import: pluginImport,
    prettier: pluginPrettier,
  },
  rules: {
    // Prettier
    ...configPrettier.rules,
    ...pluginPrettier.configs.recommended.rules,

    // Sort imports / exports
    "simple-import-sort/imports": 2,
    "simple-import-sort/exports": 2,

    // General import / export rules
    "import/first": 2,
    "import/no-duplicates": 2,
    "import/newline-after-import": 2,
    // TODO: Check why this is no longer working. Maybe the latest version of eslint broke it?
    "import/no-default-export": 2,
    "import/no-self-import": 2,
    "import/no-cycle": 2,
    "import/no-useless-path-segments": 2,
  },
};

/**
 * Rules React projects.
 * @type {import("eslint").Linter.FlatConfig}
 */
const reactRules = {
  files: ["**/*.jsx", "**/*.tsx"],
  languageOptions: { parser: parserTypescript },
  plugins: {
    react: pluginReact,
    reactHooks: pluginReactHooks,
  },
  rules: {
    ...pluginReact.configs.recommended.rules,
    "react/react-in-jsx-scope": 0,
    // Prop types not needed with TypeScript.
    "react/prop-types": 0,
  },
  settings: { react: { version: "detect" } },
};

/**
 * Rules Remix projects.
 * @type {import("eslint").Linter.FlatConfig}
 */
const remixRules = {
  files: ["**/app/routes/**/*.tsx", "**/app/routes/**/*.jsx"],
  languageOptions: { parser: parserTypescript },
  plugins: { import: pluginImport },
  rules: {
    // Remix requires the use of default exports for routes.
    "import/no-default-export": 0,
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
