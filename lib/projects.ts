import * as glob from "glob";
import * as fs from "fs";
import { FILENAME_ALL_OWNERS } from "./consts";

export const getAllProjects = () =>
  new Set(glob.sync("projects/*", {}).map((p) => p.split("/")[1]));

export const getAllProjectsForStage = (stage: string) =>
  new Set(
    glob.sync(`projects/*/${stage}.yaml`, {}).map((p) => p.split("/")[1])
  );

export const getTotalUsers = () => {
  const existingUsersData = fs.readFileSync(FILENAME_ALL_OWNERS).toString();
  return new Set(existingUsersData.split("\n").filter((s) => s.length > 0));
};
