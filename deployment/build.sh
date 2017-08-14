#!/bin/sh

# TO run this script: 'bash build.sh'
VERSION=$(git rev-parse HEAD)
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Set variables
if [ "$BRANCH" = "production" ]; then
  ENV=prod
elif [ "$BRANCH" = "staging" ]; then
  ENV=stage
else
  ENV=dev
fi

# Build angular 2 app
echo -e "${BLUE}Building ${NC}"
if npm run build.prod ; then
   echo -e "${GREEN}Build Successful${NC}"
else
  echo -e "${RED}Build not successful...exiting..${NC}"
  exit 1
fi
