const utils = require('./utils');

const fileNames = utils.getFileNames();
const translations = utils.getTranslations(fileNames);
const keysSet = translations.map(t => utils.extractKeys(t, ''));
const errors = utils.checkTranslations(keysSet, fileNames);

if (errors.length > 0) {
  errors.forEach(error => console.log(error));
  console.log('----------------------');
  console.log(`${errors.length} ERRORS FOUND`);
  console.log('----------------------');

  process.exit(1);
}
