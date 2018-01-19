const fs = require('fs');
const utils = require('./utils');

const fileNames = utils.getFileNames();
const translations = utils.getTranslations(fileNames);
const keysSet = translations.map(t => utils.extractKeys(t, ''));

const files = utils.getAllFiles();
const keys = utils.getAllUsedKeys(files);

const missingTranslations = utils.getAllMissingTranslations(keys, keysSet, fileNames);
const redundantTranslations = utils.getAllRedundantTranslations(keys, keysSet, fileNames);

if (missingTranslations.length > 0) {
  console.log('-----------ERROR---------------');
  console.log('----MISSING TRANSLATIONS-------');
  console.log(missingTranslations);
}

if (redundantTranslations.length > 0) {
  console.log('-----------WARNING---------------');
  console.log('----REDUNDANT TRANSLATIONS-----');
  console.log(redundantTranslations);
}

if (missingTranslations.length > 0) {
  process.exit(1);
}
