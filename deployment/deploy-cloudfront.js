const git = require('./utils/git.utils.js');
const cf = require('./utils/cloudfront.utils.js');

const projectName = process.argv[2];

var version;

git.getVersion()
  .then(v => {
    version = v;
    return Promise.resolve();
  })
  .then(() => git.getBranchName())
  .then(branchName => cf.createDistributionIfNotExist(projectName, branchName, version))
  .then(distribution => cf.updateDistribution(distribution, version))
  .then(distribution => cf.createInvalidation(distribution))
  .then(() => console.log('Cloudfront deploy finished'))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
