// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const simpleImportSort = require('eslint-plugin-simple-import-sort');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      // packages → components/features → hooks → api/store/config/libs → relative → constants → types
      // LIVE 03.1 — Fill in the simple-import-sort groups from CONVENTIONS.
      'simple-import-sort/imports': 'off',
    },
  },
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*'],
  },
]);
