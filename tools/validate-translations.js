const fs = require ('fs');

const fileNames = getFileNames();
const translations = getTranslations(fileNames);
const keysSet = translations.map(t => extractKeys(t, ''));
const errors = checkTranslations(keysSet, fileNames);

if (errors.length > 0) {
  errors.forEach(error => console.log(error));
  console.log('----------------------');
  console.log(`${errors.length} ERRORS FOUND`);
  console.log('----------------------');

  process.exit(1);
}

function getFileNames() {
  return fs.readdirSync('./src/app/translation/translations').filter(fileName => fileName !== 'languages.json')
}

function getTranslations(fileNames) {
  return fileNames
    .map(fileName => JSON.parse(fs.readFileSync('./src/app/translation/translations/' + fileName, 'utf8')))

}

function extractKeys(obj, parentKey) {

  if (!obj) {
    return [];
  }

  if (typeof obj === 'string') {
    return [parentKey];
  }

  let childKeys = [];

  Object.keys(obj).forEach(key => {
    childKeys = [...childKeys, ...extractKeys(obj[key], parentKey + (parentKey ? '_' : '') + key)];
  });

  return childKeys;
}


function checkTranslations(sets, names) {
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
}
