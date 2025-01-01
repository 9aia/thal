#!/bin/bash

# Configure custom hooks path
git config core.hooksPath ./codeshare/.githooks
echo "Custom Git hooks path set to ./codeshare/.githooks."

# Check if co-authors file exists
if [[ ! -f "./codeshare/co-authors" ]]; then
  echo "Creating a co-authors file at ./codeshare/co-authors from example."
  cp ./codeshare/co-authors.example ./codeshare/co-authors
fi

echo "Setup completed successfully."
