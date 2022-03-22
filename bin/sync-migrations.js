const { program } = require("commander");
const {
  getAppliedMigrations,
  getAllMigrations,
  getMigrationNumberFromFile,
} = require("../lib/migrations");
const { getKubectlForContext, getContext } = require("../lib/kubernetes");
const { renderToFile, getTemplate } = require("../lib/templates");
const handlebars = require("handlebars");
const { hbsToJson } = require("../lib/hbs-helpers");
const { getMigrationYamlFile } = require("../lib/consts");
const crypto = require("crypto");
const { getFileContent } = require("../lib/file");
const { readClusterInfo } = require("../lib/cluster-info");

// Cmd
const options = program.option("--to <to>").option("--dry-run").parse().opts();
const to = options.to;
const dryRun = options.dryRun || process.env["DRY_RUN"] === "1";
hbsToJson(handlebars);

// Perform
const allMigrations = getAllMigrations();
console.log("All migrations:", allMigrations);

const clusterInfo = readClusterInfo();
clusterInfo.forEach((cluster) => {
  const stage = cluster.stage.toLowerCase();
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
    const appliedMigration = appliedMigrations[migrationFile];
    if (appliedMigration && appliedMigration.checksum !== checksum) {
      // Migration has been changed
      console.error(
        `Mismatch in checksum for ${migrationFile}. Currently ${checksum} but applied ${appliedMigration.checksum}.`
      );
    } else if (
      !appliedMigration &&
      ((toNumber !== null && toNumber >= number) || toNumber === null)
    ) {
      // Apply migration
      console.log(`  Running migration ${migrationFile}...`);
      const module = require("../" + migrationFile);
      if (!dryRun) {
        module.up(kubectlWithContext, context);
      } else {
        console.log("-> Skipping due to dry run");
      }
      return {
        ...total,
        [migrationFile]: { checksum, ts: new Date().toISOString() },
      };
    } else if (appliedMigration && toNumber !== null && number > toNumber) {
      console.log(`  Unapply... ${migrationFile}`);
      const module = require("../" + migrationFile);
      if (!dryRun) {
        module.down(kubectlWithContext, context);
      } else {
        console.log("    -> Skipping due to dry run");
      }
      return {
        ...total,
        [migrationFile]: undefined,
      };
    } else {
      // Already applied
      console.log(`  (Migration ${migrationFile} already applied!)`);
    }
    return {
      ...total,
      [migrationFile]: { ...appliedMigration },
    };
  }, {});

  // Render yaml to apply
  if (!dryRun) {
    renderToFile(
      getTemplate(handlebars, "kubernetes", "migrations.hbs"),
      {
        migrations: new handlebars.SafeString(JSON.stringify(migrations)),
      },
      dest
    );

    // ...and apply it
    kubectlWithContext(`apply -f ${dest}`);
  } else {
    console.log("  (Skip updating state due to dryn run)");
  }
});
