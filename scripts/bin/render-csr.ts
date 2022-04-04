import { program } from "commander";
import handlebars from "handlebars";
import * as schemas from "../lib/schemas";
import { getTemplate, renderToFile } from "../lib/templates";
import { getFileContent, assertFile } from "../lib/file";
import {
  getCsrOutputFileForUsername,
  getEncodedCsrFileForUsername,
} from "../lib/consts";
import { logArgv } from "../lib/utils";

// Cmd
const options = program
  .requiredOption("--username <username>")
  .requiredOption("--stage <stage>")
  .option("--dry-run")
  .parse()
  .opts();
logArgv();
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
