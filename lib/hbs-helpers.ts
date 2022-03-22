import Handlebars from "handlebars";

export const hbsSeparator = (handlebars: any) =>
  handlebars.registerHelper(
    "sep",
    function (options: Handlebars.HelperOptions) {
      if (options.data.last) {
        // @ts-ignore
        return options.inverse();
      } else {
        // @ts-ignore
        return options.fn();
      }
    }
  );
