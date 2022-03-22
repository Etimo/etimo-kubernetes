const fs = require("fs");
const yaml = require("yaml");

const getFileContent = (filename) => fs.readFileSync(filename).toString();
const setFileContent = (filename, s) => fs.writeFileSync(filename, s);
const getYamlContentParsed = (filename) => {
  const content = getFileContent(filename);
  return yaml.parse(content);
};

const assertFile = (filename, shouldExist) => {
  if (fs.existsSync(filename) !== shouldExist) {
    if (shouldExist) console.error(`Missing file ${filename}.`);
    else console.error(`File ${filename} already exists. Will not overwrite.`);
    process.exit(1);
  }
};

const getTempFilename = () =>
  `temp/${new Date().getTime()}.${Math.random() * 100000000}`;

module.exports = {
  getFileContent,
  setFileContent,
  getYamlContentParsed,
  assertFile,
  getTempFilename,
};
