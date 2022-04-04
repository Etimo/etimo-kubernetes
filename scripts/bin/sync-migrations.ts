import { program } from "commander";
import {
  getAppliedMigrations,
  getAllMigrations,
  getMigrationNumberFromFile,
} from "../lib/migrations";
import {
  getKubectlForContext,
  getContext,
  saveDataset,
  getConfigMapKey,
} from "../lib/kubernetes";
import { getMigrationYamlFile } from "../lib/consts";
import crypto from "crypto";
import { getFileContent } from "../lib/file";
import { readClusterInfo } from "../lib/cluster-info";
import { logArgv } from "../lib/utils";

// Cmd
const options = program.option("--to <to>").option("--dry-run").parse().opts();
logArgv();
const to = options.to;
const dryRun = options.dryRun || process.env["DRY_RUN"] === "1";

// Perform
const allMigrations = getAllMigrations();
console.log("All migrations:", allMigrations);

const clusterInfo = readClusterInfo();
clusterInfo.forEach((cluster) => {
  const stage = cluster.stage;
  const clusterName = cluster.clusterName;
  const context = getContext(clusterName);
  const kubectlWithContext = getKubectlForContext(context);
  const appliedMigrations = getAppliedMigrations(kubectlWithContext) || {};
  console.log(`Applying migrations to ${clusterName}...`);

  const dest = getMigrationYamlFile(stage);
  const toNumber = to ? parseInt(to) : null;
  console.log("Applied migrations:", appliedMigrations);
  const migrations = allMigrations.reduce((total, migrationFile) => {
    const number = getMigrationNumberFromFile(migrationFile);
    const shasum = crypto.createHash("sha1");
    shasum.update(getFileContent(migrationFile));
    const checksum = shasum.digest("hex");
    const migrationFileKey = getConfigMapKey(migrationFile);
    const appliedMigration = appliedMigrations[migrationFileKey];
    if (appliedMigration && appliedMigration.checksum !== checksum) {
      // Migration has been changed
      console.error(
        `Mismatch in checksum for ${migrationFile}. Currently ${checksum} but applied ${appliedMigration.checksum}.`
      );
    } else if (!appliedMigration) {
      // Apply migration
      console.log(`  Running migration ${migrationFile}...`);
      const module = require("../" + migrationFile);
      if (!dryRun) {
        try {
          module.up(kubectlWithContext, context);

          // Only consider this migration applied if there were no errors
          return {
            ...total,
            [migrationFile]: { checksum, ts: new Date().toISOString() },
          };
        } catch (e) {
          console.error(
            "    Something went wrong in migration! Will run again next time."
          );
          console.error(e);
          // Something went wrong in the migration, skip it for now so it can be applied next time
          return { ...total };
        }
      } else {
        console.log("    -> Skipping due to dry run");
      }
      // } else if (appliedMigration && toNumber !== null && number > toNumber) {
      //   console.log(`  Unapply... ${migrationFile}`);
      //   const module from "../" + migrationFile);
      //   if (!dryRun) {
      //     module.down(kubectlWithContext, context);
      //   } else {
      //     console.log("    -> Skipping due to dry run");
      //   }
      //   return {
      //     ...total,
      //     [migrationFile]: undefined,
      //   };
    } else {
      // Already applied
      console.log(
        `  (Migration ${migrationFile} already applied at ${appliedMigration.ts})`
      );
    }
    return {
      ...total,
      [migrationFile]: { ...appliedMigration },
    };
  }, {});

  // Render yaml to apply
  if (!dryRun) {
    saveDataset(kubectlWithContext, "migrations", migrations);
  } else {
    console.log("  (Skip updating state due to dryn run)");
  }
});
