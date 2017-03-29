var fs = require('fs');

fs.readFile('./src/environments/environment.prod.ts', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var name = process.argv[2].substring(0, 8);
  var result = data.replace(/0.0.0/g, name);

  fs.writeFile('./src/environments/environment.prod.ts', result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
