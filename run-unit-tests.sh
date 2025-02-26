#!/bin/bash

# Script to run the steganography unit tests

# Ensure TypeScript is compiled
echo "Building the project..."
npx tsc --project client/tsconfig.json

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Build failed. Exiting."
  exit 1
fi

# Run the unit tests using Node.js
echo "Running unit tests..."
node -e "require('./client/dist/src/unit-tests').runUnitTests()"