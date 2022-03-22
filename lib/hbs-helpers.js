const hbsSeparator = (handlebars) =>
  handlebars.registerHelper("sep", function (options) {
    if (options.data.last) {
      return options.inverse();
    } else {
      return options.fn();
    }
  });

const hbsToJson = (handlebars) =>
  handlebars.registerHelper("toJSON", function (obj) {
    return JSON.stringify(obj, null, 2);
  });

module.exports = {
  hbsSeparator,
  hbsToJson,
};
