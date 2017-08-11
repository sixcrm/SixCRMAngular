#!/bin/sh

# TO run this script: 'bash build.sh'
SOURCE_DIR=dist/

# Set variables
if [ "$2" = "production" ]; then
  BUCKET=$1
	DISTRIBUTION_ID=E1HK8K7V5BNVFH
  ENV=prod
elif [ "$2" = "staging" ]; then
  BUCKET=staging-$1
	DISTRIBUTION_ID=E2SGEZF5528QQQ
  ENV=stage
else
	BUCKET=development-$1
	DISTRIBUTION_ID=E2VUS6PRSO1ALB
  ENV=dev
fi

VERSION=$(git rev-parse HEAD)

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create bucket if does not exist
if aws s3 ls | grep ${BUCKET} ; then
	echo -e "${BLUE}Bucket '${BUCKET}' exists${NC}"
else
  echo -e "${BLUE}Bucket ${BUCKET} does not exists ${NC}"
  echo -e "${BLUE}Making bucket ${BUCKET}, region ${AWS_REGION}...${NC}"

  if aws s3 mb s3://${BUCKET} --region ${AWS_REGION} ; then
    echo -e "${GREEN}Bucket ${BUCKET} successfully created...${NC}"
  else
    echo -e "${RED}Bucket ${BUCKET} creation unsuccessful...exiting...${NC}"
    exit 1
  fi
fi

# Version and build angular 2 app
echo -e "${BLUE}Building ${NC}"
node versioning.js $VERSION $ENV
if npm run build.${ENV} ; then
   echo -e "${GREEN}Build Successful${NC}"
else
  echo -e "${RED}Build not successful...exiting..${NC}"
  exit 1
fi

exit 1

# Upload to S3
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

# Update CloudFront
echo -e "${BLUE}Updating CloudFront${NC}"
ETag=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID | jq '.ETag' | sed -e 's/^"//' -e 's/"$//')
VERSION="/$VERSION"
aws cloudfront get-distribution-config --id $DISTRIBUTION_ID | jq --arg v "$VERSION" '.DistributionConfig.Origins.Items[0].OriginPath=$v' | jq '.DistributionConfig' > distributionConfigRevised.json
aws cloudfront update-distribution --id $DISTRIBUTION_ID --if-match $ETag --distribution-config file://distributionConfigRevised.json
echo -e "${BLUE}Clean up${NC}"
rm distributionConfigRevised.json
rm -rf dist

# Build finished successfully
echo -e "${GREEN}Deployment complete${NC}"
