const fs = require('fs');
const git = require('./utils/git.utils');

git.getVersion()
  .then(version => {
    return git.getBranchName()
      .then(branch => {
        const env = branch === 'production' ? 'prod' : (branch === 'staging' ? 'stage' : 'dev');
        const f = `./src/environments/environment.${env}.ts`;
        const v = version.trim().substring(0, 8);

        updateVersion(f, v);
      })
  }).catch(err => {
    console.log(err);
    process.exit(1);
  });

function updateVersion(file, version) {
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    var result = data.replace(/0.0.0/g, version);

    fs.writeFile(file, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });

}
