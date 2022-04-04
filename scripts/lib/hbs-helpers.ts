import Handlebars from "handlebars";
import { getFileContent } from "./file";

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

export const registerPartialDb = (handlebars: any) =>
  handlebars.registerPartial(
    "db",
    getFileContent("templates/terraform/db.hbs")
  );
