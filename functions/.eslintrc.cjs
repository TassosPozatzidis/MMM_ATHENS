module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module",
    "allowImportExportEverywhere": true
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    quotes: ["error", "double"],
    "indent": "off",
    "max-len": ["error", { "code": 180 }]
  },
};
