/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    './index.js',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'warn',
  },
};
