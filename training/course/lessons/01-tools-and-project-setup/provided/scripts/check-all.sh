#!/bin/sh
# Runs every quality gate in every app: lint, type-check, test. Run it with `yarn run check`
# (plain `yarn check` is a built-in Yarn 1 command that does something else).
set -e
for app in dashboard mobile; do
  echo "\n▶ $app"
  yarn --cwd "$app" --silent lint
  yarn --cwd "$app" --silent typecheck
  yarn --cwd "$app" --silent test --passWithNoTests
done
