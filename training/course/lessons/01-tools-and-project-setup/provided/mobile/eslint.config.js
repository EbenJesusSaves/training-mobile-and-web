// Course version (lesson 01) — lesson 03 adds the import-order rule and becomes the RailPass config.
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([...expoConfig]);
