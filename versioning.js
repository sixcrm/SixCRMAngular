var fs = require('fs');
var exec = require('child_process').exec;

var env = process.argv[3] === 'prod' ? '.prod' : (process.argv[3] === 'stage' ? '.stage' : '.dev');
var envFile = './src/environments/environment' + env +'.ts';
var version;

exec('git rev-parse HEAD', (err, stdout) => {
  if (err) {
    console.log(err);
    process.exit(1);
  };

  version = stdout.trim().substring(0, 8);
  updateVersion();
})

function updateVersion() {
  fs.readFile(envFile, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    var result = data.replace(/0.0.0/g, version);

    fs.writeFile(envFile, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });

}
