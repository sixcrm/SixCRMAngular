#!/bin/sh

# TO run this script: 'bash build.sh'

BUCKET=admin.sixcrm.com

SOURCE_DIR=dist/

DISTRIBUTION_ID=ECG7677RUQHZK

VERSION=$(git rev-parse HEAD)

export AWS_DEFAULT_REGION=us-east-1

RED='\033[0;31m'

GREEN='\033[0;32m'

BLUE='\033[0;34m'

NC='\033[0m'

echo -e "${BLUE}Building production${NC}"

node versioning.js $VERSION

if npm run build.prod ; then

   echo -e "${GREEN}Build Successful${NC}"

else

  echo -e "${RED}Build not successful...exiting..${NC}"

  exit 1

fi

echo -e "${BLUE}Setting a version on the build${NC}"

# dist/builtFiles => dist/version/buildFiles

cp -R dist/. $VERSION

rm -rf dist

mkdir dist

mv $VERSION dist

echo -e "${BLUE}Attempting to upload site ..${NC}"

if aws s3 cp dist s3://${BUCKET}/ --recursive ; then

  echo -e "${GREEN}S3 Upload complete${NC}"

else

  echo -e "${RED}Sync to S3 failed${NC}"

  exit 1

fi

echo -e "${BLUE}Updating CloudFront${NC}"

ETag=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID | jq '.ETag' | sed -e 's/^"//' -e 's/"$//')

VERSION="/$VERSION"

aws cloudfront get-distribution-config --id $DISTRIBUTION_ID | jq --arg v "$VERSION" '.DistributionConfig.Origins.Items[0].OriginPath=$v' | jq '.DistributionConfig' > distributionConfigRevised.json

aws cloudfront update-distribution --id $DISTRIBUTION_ID --if-match $ETag --distribution-config file://distributionConfigRevised.json

echo -e "${BLUE}Clean up${NC}"

rm distributionConfigRevised.json

rm -rf dist

echo -e "${GREEN}Deployment complete${NC}"
