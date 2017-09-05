const aws = require('aws-sdk');

aws.config.apiVersions = {cloudfront: '2017-03-25'};
const cloudfront = new aws.CloudFront();

exports.createDistributionIfNotExist = (projectName, branchName, version) => {
  let bucketName = `${branchName}-${projectName}`;

  return exists(bucketName)
    .then(distributionId => {
      if (!distributionId) {
        return createDistribution(bucketName, version);
      }

      return Promise.resolve(distributionId);
    })
};

exports.updateDistribution = (distributionId, version) => {
  console.log(`Updating distribution ${distributionId}, version: ${version}`);

  return getDistributionConfig(distributionId)
    .then(config => {
      let params = {
        Id: distributionId,
        IfMatch: config.ETag,
        DistributionConfig: config.DistributionConfig
      };
      params.DistributionConfig.Origins.Items[0].OriginPath = `/${version}`;

      return new Promise((resolve, reject) => {
        cloudfront.updateDistribution(params, (error, data) => {
          if (error) reject(error);

          console.log(`Distribution ${distributionId} successfully updated`);
          resolve(distributionId);
        })
      })
    })
};

exports.createInvalidation = (distributionId) => {
  console.log(`Creating invalidation, distribution ID: ${distributionId}`);

  return new Promise((resolve, reject) => {
    const params = {
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: `${Date.now()}`,
        Paths: {
          Quantity: 1,
          Items: ['/index.html']
        }
      }
    };

    cloudfront.createInvalidation(params, (error, data) => {
      if (error) reject(error);

      console.log(`Invalidation for distribution ID: '${distributionId}' created`);
      resolve();
    })
  })
};

function getDistributionConfig(distributionId) {
  return new Promise((resolve, reject) => {
    cloudfront.getDistributionConfig({Id: distributionId}, (error, data) => {
      if (error) reject(error);

      resolve(data);
    })
  })
}

function exists(bucketName) {
  return new Promise((resolve, reject) => {

    cloudfront.listDistributions({}, (error, data) => {
      if (error) return reject(error);

      let distributions = data.Items.filter(i => i.Origins.Items[0].Id === `S3-${bucketName}`);

      if (!distributions || distributions.length === 0) {
        resolve(false);
      } else {
        resolve(distributions[0].Id);
      }
    })

  });
}

function createDistribution(bucketName, version) {
  console.log(`Creating distribution form ${bucketName}, version: ${version}`);

  return new Promise((resolve, reject) => {
    let params = {
      DistributionConfig: {
        CallerReference: bucketName,
        DefaultCacheBehavior: {
          TargetOriginId: `S3-${bucketName}`,
          ForwardedValues: {
            QueryString: true,
            Cookies: { Forward: 'all' },
            Headers: { Quantity: 0, Items: [] },
            QueryStringCacheKeys:{ Quantity: 0, Items: [] }
          },
          TrustedSigners: { Enabled: false, Quantity: 0, Items: [] },
          ViewerProtocolPolicy: 'redirect-to-https',
          MinTTL: 0,
          AllowedMethods: {
            Quantity: 3,
            Items: [ 'HEAD', 'GET', 'OPTIONS' ],
            CachedMethods: { Quantity: 2, Items: ['HEAD', 'GET'] }
          },
          SmoothStreaming: false,
          DefaultTTL: 86400,
          MaxTTL: 31536000,
          Compress: false,
          LambdaFunctionAssociations: { Quantity: 0, Items: [] } }
        ,
        Comment: '',
        Enabled: true,
        Origins: {
          Quantity: 1,
          Items: [
            {
              Id: `S3-${bucketName}`,
              DomainName: `${bucketName}.s3.amazonaws.com`,
              OriginPath: `/${version}`,
              S3OriginConfig: { OriginAccessIdentity: '' }
            }
          ]
        }
      }
    };

    cloudfront.createDistribution(params, (error, data) => {
      if (error) return reject(error);

      console.log(`Distribution for ${bucketName} created`);
      resolve(data.Id);
    })
  })

}
