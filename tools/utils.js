const fs = require ('fs');
const path = require('path');

module.exports.getFileNames = () => {
  return fs.readdirSync('./src/app/translation/translations').filter(fileName => fileName !== 'languages.json')
};

module.exports.getTranslations = (fileNames) => {
  return fileNames
    .map(fileName => JSON.parse(fs.readFileSync('./src/app/translation/translations/' + fileName, 'utf8')))

};

module.exports.extractKeys = (obj, parentKey) => {

  if (!obj) {
    return [];
  }

  if (typeof obj === 'string') {
    return [parentKey];
  }

  let childKeys = [];

  Object.keys(obj).forEach(key => {
    childKeys = [...childKeys, ...this.extractKeys(obj[key], parentKey + (parentKey ? '_' : '') + key)];
  });

  return childKeys;
};


module.exports.checkTranslations = (sets, names) => {
  let errors = [];

  for (let i = 0; i < sets.length; i++) {
    sets[i].forEach(key => {
      for (let j = 0; j < sets.length; j++) {
        if (!sets[j].find((el) => el === key)) {
          errors.push(`${key} found in ${names[i]} but not found in ${names[j]}`)
        }
      }
    })
  }

  return errors;
};


module.exports.getAllRedundantTranslations = (keys, keysSet, fileNames) => {
  let redundantTranslations = [];

  for (let i = 0; i < keysSet.length; i++) {
    keysSet[i].forEach(key => {
      if (!keys.find((el) => el === key)) {
        redundantTranslations.push(`${key} from ${fileNames[i]} is unused`);
      }
    })
  }

  return redundantTranslations;
};

module.exports.getAllMissingTranslations = (keys, keysSet, fileNames) => {
  let missingTranslations = [];

  keys.forEach(key => {
    for (let i = 0; i < keysSet.length; i++) {
      if (!keysSet[i].find((el) => el === key)) {
        missingTranslations.push(`${key} missing in ${fileNames[i]}`);
      }
    }
  });

  return missingTranslations;
};

module.exports.getAllUsedKeys = (files) => {
  let keys = [];

  files.forEach(fileName => {
    const content = fs.readFileSync(fileName, 'utf8');
    const pattern = /'[A-Z0-9]+_[A-Z0-9_]*[A-Z0-9]'/g;
    const matches = content.match(pattern);

    if (matches) {
      keys = [...keys, ...matches.map(m => m.replace(/'/g, '').toLowerCase()).filter(m => m!=='non_null' && m!=='input_object')];
    }
  });

  return keys;
};

module.exports.getAllFiles = () => {
  const allFiles = walkSync('./src/app');

  return allFiles.filter(f => f.endsWith('.html') || f.endsWith('.ts'));
};

function walkSync(dir) {
  if (!fs.lstatSync(dir).isDirectory()) {
    return [dir];
  }

  let files = [];
  fs.readdirSync(dir).forEach(f => {
    files = [...files, ...walkSync(path.join(dir, f))];
  });

  return files;
}


