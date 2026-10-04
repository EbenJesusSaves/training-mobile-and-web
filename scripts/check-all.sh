#!/bin/sh
# Runs every quality gate in every app. Used by CI-style checks and before a release.
set -e
for app in backend dashboard mobile; do
  echo "\n▶ $app"
  yarn --cwd "$app" --silent lint
  yarn --cwd "$app" --silent typecheck
  yarn --cwd "$app" --silent test
done
