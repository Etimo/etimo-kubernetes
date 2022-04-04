import glob from "glob";
import { MIGRATIONS_GLOB } from "./consts";
import {
  AppliedMigration,
  AppliedMigrations,
  KubeCtlWithContext,
} from "./interfaces";
import { getDataset } from "./kubernetes";

export const getAppliedMigrations = (
  kubectlWithContext: KubeCtlWithContext
): AppliedMigrations | null =>
  getDataset<AppliedMigration>(kubectlWithContext, "migrations");

export const getAllMigrations = () => glob.sync(MIGRATIONS_GLOB);

export const getMigrationNumberFromFile = (file: string): number | null => {
  const match = /\/(\d+)_/.exec(file);
  if (match) {
    return parseInt(match[1]);
  }
  return null;
};
