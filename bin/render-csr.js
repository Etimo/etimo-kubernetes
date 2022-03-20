const { program } = require("commander");
const handlebars = require("handlebars");
const schemas = require("../lib/schemas");
const { getTemplate, renderToFile } = require("../lib/templates");
const { getFileContent, assertFile } = require("../lib/file");
const {
  getCsrOutputFileForUsername,
  getEncodedCsrFileForUsername,
} = require("../lib/consts");

// Cmd
const options = program
  .requiredOption("--username <username>")
  .requiredOption("--stage <stage>")
  .option("--dry-run")
  .parse()
  .opts();
const username = options.username;
const dryRun = options.dryRun || process.env["DRY_RUN"] === "1";
const stage = options.stage;
const csrFile = getEncodedCsrFileForUsername(username, stage);

// Validation
schemas.assertValidData(username, schemas.schemaGithubUsername);
assertFile(csrFile, true);

// Perform
console.log(`Rendering csr template...`);
const csr = getFileContent(csrFile);
const dest = getCsrOutputFileForUsername(username, stage);
const template = getTemplate(handlebars, "kubernetes", "csr.hbs");

if (!dryRun) {
  renderToFile(
    template,
    {
      csr,
      username,
    },
    dest
  );
  console.log(`  -> Rendered template to ${dest}!`);
} else {
  console.log("  (Skipping rendering due to dryn run)");
}
