const parserTypescript = require("@typescript-eslint/parser");

const pluginTypescript = require("@typescript-eslint/eslint-plugin");
const pluginSimpleImportSort = require("eslint-plugin-simple-import-sort");
const pluginImport = require("eslint-plugin-import");
const pluginReact = require("eslint-plugin-react");
const pluginReactHooks = require("eslint-plugin-react-hooks");
const pluginPrettier = require("eslint-plugin-prettier");

const configPrettier = require("eslint-config-prettier");

/**
 * @param {{ react?: boolean, remix?: booleam }} [options]
 * @returns {import("eslint").Linter.FlatConfig}
 */
module.exports = function getConfig(options) {
  const config = [typeScriptRules, typeJavaScriptRules];

  if (options?.react) {
    config.push(reactRules);
  }

  if (options?.remix) {
    config.push(remixRules);
  }

  return config;
};

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
