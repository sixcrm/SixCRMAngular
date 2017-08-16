const git = require('./utils/git.utils');

git.getBranchName()
  .then(branch => {
    let from = branch;
    let to = branch === 'development' ? 'staging' : 'production';

    return git.checkout('.')
      .then(() => git.fetch('--all'))
      .then(() => git.checkout(to))
      .then(() => git.merge(from))
      .then(() => git.pushOrigin())
      .then(() => Promise.resolve({from: from, to: to}));
  })
  .then(response => console.log(`Successfully propagated from '${response.from}' to '${response.to}'`))
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
