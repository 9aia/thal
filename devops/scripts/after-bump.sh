#!/bin/sh

version="$1"

echo "Updating version in README..."
bash ./update-readme-version.sh "$version"

echo "Building and deploying..."

if echo "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+-[0-9]+$'; then
  echo "Version is a pre-release version, deploying to preview."
  pnpm run build:preview && pnpm run deploy:preview
elif echo "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "Version is a release version, deploying to production."
  pnpm run build:prod && pnpm run deploy:prod
else
  echo "Version is not valid. Please provide a valid version."
  exit 1
fi