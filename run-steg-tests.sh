#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# ANSI color codes for prettier output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Steganography Testing Suite ===${NC}"
echo

# Check for UI flag
if [ "$1" == "--ui" ]; then
  echo -e "${BLUE}Starting Vitest UI...${NC}"
  echo -e "${BLUE}Open your browser to view the test results.${NC}"
  npx vitest --ui client/src/vitest-tests.ts
  exit $?
fi

# Run the unit tests
echo -e "${YELLOW}Running unit tests...${NC}"
npx vitest run client/src/vitest-tests.ts

# Check exit code
if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}✅ All tests passed!${NC}"
else
  echo -e "\n${RED}❌ Some tests failed. Check the logs above for details.${NC}"
  echo -e "${YELLOW}For a more detailed view, run with the --ui flag:${NC}"
  echo -e "${BLUE}  ./run-steg-tests.sh --ui${NC}"
fi

echo
echo -e "${YELLOW}=== Test execution complete ===${NC}"