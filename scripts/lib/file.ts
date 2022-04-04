import * as fs from "fs";
import * as yaml from "yaml";

export const getFileContent = (filename: string) =>
  fs.readFileSync(filename).toString();
export const setFileContent = (filename: string, s: string) =>
  fs.writeFileSync(filename, s);
export const getYamlContentParsed = <T>(filename: string): T => {
  const content = getFileContent(filename);
  return yaml.parse(content) as T;
};

export const assertFile = (filename: string, shouldExist: boolean) => {
  if (fs.existsSync(filename) !== shouldExist) {
    if (shouldExist) console.error(`Missing file ${filename}.`);
    else console.error(`File ${filename} already exists. Will not overwrite.`);
    process.exit(1);
  }
};

export const getTempFilename = () =>
  `temp/${new Date().getTime()}.${Math.random() * 100000000}`;
