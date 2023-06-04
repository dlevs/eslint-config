# ESLint config

An ESLint config for TypeScript projects.

## Install it

```sh
npm i -D eslint @dlevs/eslint-config
```

## Use it

Make an `eslint.config.js` file:

```js
const { configure } = require('@dlevs/eslint-config')

module.exports = [
  {
    // Use this instead of a .eslintignore file.
    ignores: ['build/**', 'public/**'],
  },
  ...configure({ react: true, remix: true })
]
```

Note, `.eslintrc` files won't work - you must name the file `eslint.config.js`, and use the ["flat config" format](https://eslint.org/blog/2022/08/new-config-system-part-2/). It was implemented this way as it's [the only way to include plugins in a shareable config](https://github.com/eslint/eslint/issues/3458).

## Update VSCode settings

If using VSCode, set the following in your `settings.json` file:

```json
{
  "eslint.experimental.useFlatConfig": true
}
```

Ideally, do this for the workspace so it will work out of the box for anyone who clones the repository. Do this by updating (or creating) the `.vscode/settings.json` file in your project.
