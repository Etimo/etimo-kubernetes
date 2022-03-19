const fs = require("fs");
const yaml = require("yaml");

const getFileContent = (filename) => fs.readFileSync(filename).toString();

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

module.exports = {
  getFileContent,
  getYamlContentParsed,
  assertFile,
};
