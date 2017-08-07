var fs = require('fs');

var env = process.argv[3] === 'prod' ? '.prod' : (process.argv[3] === 'stage' ? '.stage' : '.dev');
var envFile = './src/environments/environment' + env +'.ts';

fs.readFile(envFile, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var name = process.argv[2].substring(0, 8);
  var result = data.replace(/0.0.0/g, name);

  fs.writeFile(envFile, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
