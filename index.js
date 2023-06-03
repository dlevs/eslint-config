/**
 * Common config for node projects.
 *
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "simple-import-sort", "import", "prettier"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  rules: {
    "simple-import-sort/imports": 2,
    "simple-import-sort/exports": 2,
    "import/first": 2,
    "import/no-duplicates": 2,
    "import/newline-after-import": 2,
    "import/no-default-export": 2,
    "import/no-self-import": 2,
    "import/no-cycle": 2,
    "import/no-useless-path-segments": 2,
  },
  overrides: [
    // Disable default export rule for remix routes, which require this convention.
    {
      files: ["app/routes/**/*.tsx"],
      rules: {
        "import/no-default-export": 0,
      },
    },
  ],
};
