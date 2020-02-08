'use strict';

const OFF = 0;
const ERROR = 2;

module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    'plugin:react/recommended',
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint"
  ],
  plugins: [
    "@typescript-eslint"
  ],
  env: { node: true, es6: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    project: "./tsconfig.json"
  },
  settings: {
    react: {
      "pragma": "React",
      "version": "detect",
    },
  },
  rules: {
    quotes: [ERROR, "single"],
    "@typescript-eslint/explicit-function-return-type": [OFF],
    "@typescript-eslint/interface-name-prefix": [OFF],
  }
};
