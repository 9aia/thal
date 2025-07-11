#!/bin/sh

version="$1"

echo "Running after-bump script..."

echo "Updating version in README..."
bash ./devops/scripts/update-version-in-readme.sh "$version"

if echo "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+-[0-9]+$'; then
  echo "Version is a pre-release version, deploying to preview."
  pnpm run build:preview && pnpm run deploy:preview
elif echo "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "Version is a release version."
  echo "Creating DB dump..."
  pnpm run db:dump:prod
  echo "DB dump created, now building and deploying to production..."
  pnpm run build:prod && pnpm run deploy:prod
else
  echo "Version is not valid. Please provide a valid version."
  exit 1
fi