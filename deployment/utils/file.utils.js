const fs = require('fs');

exports.getAllPaths = (root, result) => {
  if (!result) result = [];

  fs.readdirSync(root).forEach(file => {
    let p = `${root}/${file}`;

    if (fs.statSync(p).isDirectory()) {
      result = result.concat(this.getAllPaths(p, []));
    } else {
      result = result.concat([p]);
    }
  });

  return result;
};
