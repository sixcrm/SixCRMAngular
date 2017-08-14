const git = require('./utils/git.utils.js');
const s3 = require('./utils/s3.utils');

const projectName = process.argv[2];

git.getBranchName()
  .then(branchName => s3.createBucketIfNotExist(projectName, branchName))
  .then(bucketName => s3.setStaticHosting(bucketName))
  .then(bucketName => s3.setPolicies(bucketName))
  .then(bucketName => s3.upload(bucketName))
  .then(() => console.log('S3 Deploy finished'))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });



