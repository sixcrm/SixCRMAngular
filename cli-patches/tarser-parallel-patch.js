const fs = require('fs');
const f = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/common.js';

fs.readFile(f, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/parallel: true/g, 'parallel: 4');

  console.log(result);

  fs.writeFile(f, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});