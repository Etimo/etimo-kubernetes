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
const { MIGRATIONS_YAML } = require("../lib/consts");
const crypto = require("crypto");
const { getFileContent } = require("../lib/file");

// Cmd
const options = program
  .requiredOption("--cluster-name <cluster_name>")
  .option("--to <to>")
  .option("--dry-run")
  .parse()
  .opts();
const clusterName = options.clusterName;
const to = options.to;
const dryRun = options.dryRun || process.env["DRY_RUN"] === "1";
const context = getContext(clusterName);
const kubectlWithContext = getKubectlForContext(context, 4);
hbsToJson(handlebars);

// Perform
const allMigrations = getAllMigrations();
console.log("All migrations:", allMigrations);
const appliedMigrations = getAppliedMigrations(kubectlWithContext) || {};

if (!dryRun) {
  const dest = MIGRATIONS_YAML;
  const toNumber = to ? parseInt(to) : null;
  console.log(`Applying migrations to ${clusterName}...`);
  console.log(appliedMigrations);
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
      module.up(kubectlWithContext, context);
      return {
        ...total,
        [migrationFile]: { checksum, ts: new Date().toISOString() },
      };
    } else if (appliedMigration && toNumber !== null && number > toNumber) {
      console.log(`  Unapply... ${migrationFile}`);
      const module = require("../" + migrationFile);
      module.down(kubectlWithContext, context);
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
  console.log("  (Skipping rendering due to dryn run)");
}
