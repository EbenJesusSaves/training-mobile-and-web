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
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^react', '^@?\\w'],
            ['^@/components/', '^@/features/'],
            ['^@/hooks/'],
            ['^@/'],
            ['^\\.'],
            ['^@/constants/'],
            ['^.+\\u0000$'],
          ],
        },
      ],
    },
  },
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*'],
  },
]);
