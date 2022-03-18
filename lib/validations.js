const fs = require("fs");
const yaml = require("yaml");

const validateYamlFile = (filename, schema, extraContext = {}) => {
  const yamlData = fs.readFileSync(filename).toString();
  const yamlDataParsed = yaml.parse(yamlData);
  const validationResult = schema.validate({
    ...yamlDataParsed,
    ...extraContext,
  });
  if (validationResult.error) {
    console.error(validationResult.error);
    process.exit(1);
  }
  return yamlDataParsed;
};

module.exports = {
  validateYamlFile,
};
