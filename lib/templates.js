const fs = require("fs");
const path = require("path");

const getTemplate = (handlebars, category, file) => {
  const templateStr = fs
    .readFileSync(path.join("templates", category, file))
    .toString();
  return handlebars.compile(templateStr);
};

const renderToFile = (template, data, dest) =>
  fs.writeFileSync(dest, template(data));

const assertValidData = (data, schema) => {
  const validationResult = schema.validate(data);
  if (validationResult.error) {
    console.error(validationResult.error);
    process.exit(1);
  }
};

module.exports = {
  getTemplate,
  renderToFile,
  assertValidData,
};
