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

module.exports = {
  getTemplate,
  renderToFile,
};
