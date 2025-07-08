#!/bin/sh

version="$1"

if echo "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+-[0-9]+$'; then
  echo "Version is a pre-release version, updating preview version in README."
  sed -E -i "s/\[🧪 \*\*Preview v[0-9]+\.[0-9]+\.[0-9]+-[0-9]+\*\*\]\([^)]*\)/[🧪 **Preview v$version**](https:\/\/preview.thal.9aia.com)/g" README.md
elif echo "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "Version is a release version, updating production version in README."
  sed -E -i "s/\[🚀 \*\*Production v[0-9]+\.[0-9]+\.[0-9]+( \(planned\))?\*\*\]\([^)]*\)/[🚀 **Production v$version**](https:\/\/thal.9aia.com)/g" README.md
else
  echo "Cannot update version in README. Version is not valid. Please provide a valid version."
  exit 1
fi