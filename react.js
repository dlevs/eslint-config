/**
 * Common config for react projects.
 *
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  extends: ["./index.js", "plugin:react/recommended"],
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["react", "react-hooks"],
  rules: {
    "react/react-in-jsx-scope": 0,
    "react/prop-types": 0,
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
