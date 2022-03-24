import * as fs from "fs";
import * as path from "path";
import * as H from "handlebars";

export const getTemplate = (
  handlebars: any,
  category: string,
  file: string
) => {
  const templateStr = fs
    .readFileSync(path.join("templates", category, file))
    .toString();
  return handlebars.compile(templateStr);
};

export const renderToFile = (
  template: H.TemplateDelegate,
  data: unknown,
  dest: string
) => {
  // Make sure path exists
  const p = path.dirname(dest);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
  fs.writeFileSync(dest, template(data));
};
