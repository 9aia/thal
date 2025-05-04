#!/bin/sh

version="$1"

if echo "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+-[0-9]+$'; then
  echo "Version is a pre-release version, deploying to preview."
  pnpm run build:preview && pnpm run deploy
elif echo "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "Version is a release version, deploying to production."
  pnpm run build:prod && pnpm run deploy
else
  echo "Version is not valid. Please provide a valid version."
  exit 1
fi