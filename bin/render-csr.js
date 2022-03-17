const { program } = require("commander");
const handlebars = require("handlebars");
const fs = require("fs");

const schemas = require("../lib/schemas");
const { getTemplate, renderToFile } = require("../lib/templates");

// Cmd
const options = program
  .option("--username <username>")
  .option("--dry-run")
  .parse()
  .opts();
const username = options.username;
const dryRun = options.dryRun;

// Validation
const validationResult = schemas.schemaGithubUsername.validate(username);
if (validationResult.error) {
  console.error(validationResult.error);
  process.exit(1);
}

// Look for csr
const csrFile = `${username}-base64-encoded.csr`;
if (!fs.existsSync(csrFile)) {
  console.error(`No csr file found (${csrFile}). Please create csr first.`);
  process.exit(1);
}

const csr = fs.readFileSync(csrFile).toString();

console.log(`Rendering csr template...`);
const dest = `csr-${username}.yaml`;
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
