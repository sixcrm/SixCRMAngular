const exec = require('child_process').exec;

exports.getBranchName = function() {
  return execute('git rev-parse --abbrev-ref HEAD');
};

exports.getVersion = function() {
  return execute('git rev-parse HEAD');
};

exports.checkout = function(branch) {
  console.log(`checking out ${branch}`);

  return execute(`git checkout ${branch}`)
};

exports.fetch = function(branch) {
  console.log(`fetching ${branch}`);

  return execute(`git fetch ${branch}`)
};

exports.merge = function(branch) {
  console.log(`merging ${branch}`);

  return execute(`git merge ${branch}`)
};

exports.pushOrigin = function(branch) {
  console.log(`pushing origin ${branch}`);

  return execute(`git push origin ${branch}`)
};

function execute(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) return reject(err);

      resolve(stdout.trim());
    })
  })
}
