import * as fs from "fs";
import Joi from "joi";
import * as yaml from "yaml";

export const validateYamlFile = (
  filename: string,
  schema: Joi.Schema,
  extraContext = {}
) => {
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
