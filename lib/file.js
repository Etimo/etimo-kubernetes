const fs = require("fs");
const yaml = require("yaml");

const getFileContent = (filename) => fs.readFileSync(filename).toString();

const getYamlContentParsed = (filename) => {
  const content = getFileContent(filename);
  return yaml.parse(content);
};

module.exports = {
  getFileContent,
  getYamlContentParsed,
};
