const hbsSeparator = (handlebars) =>
  handlebars.registerHelper("sep", function (options) {
    if (options.data.last) {
      return options.inverse();
    } else {
      return options.fn();
    }
  });

module.exports = {
  hbsSeparator,
};
