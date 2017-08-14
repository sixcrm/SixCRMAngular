const exec = require('child_process').exec;

exports.getBranchName = function() {
  return execute('git rev-parse --abbrev-ref HEAD');
};

exports.getVersion = function() {
  return execute('git rev-parse HEAD');
};

function execute(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) return reject(err);

      resolve(stdout.trim());
    })
  })
}
