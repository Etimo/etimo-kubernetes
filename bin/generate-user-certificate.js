const { program } = require("commander");
const shelljs = require("shelljs");
const schemas = require("../lib/schemas");
const { assertValidData } = require("../lib/templates");
const {
  getCertFileForUsername,
  getCsrFileForUsername,
  getCsrOutputFileForUsername,
} = require("../lib/consts");
const { assertFile } = require("../lib/file");

// Cmd
const options = program
  .requiredOption("--username <username>")
  .option("--dry-run")
  .parse()
  .opts();
const username = options.username;
const dryRun = options.dryRun;
const certFile = getCertFileForUsername(username);
const csrFile = getCsrFileForUsername(username);
const csrOutputFile = getCsrOutputFileForUsername(username);

// Validation
assertValidData(username, schemas.schemaGithubUsername);
assertFile(certFile, false);

// Perform
if (!dryRun) {
  console.log(`Generating certificate for ${username}...`);
  shelljs.exec(`node ./bin/generate-csr.js --username ${username}`);
  shelljs.exec(`yarn render:csr --username ${username}`);
  shelljs.exec(`kubectl apply -f ${csrOutputFile}`);
  shelljs.exec(`kubectl certificate approve ${username}`);
  shelljs
    .exec(`kubectl get csr ${username} -o jsonpath='{.status.certificate}'`, {
      silent: true,
    })
    .exec(`base64 --decode`, { silent: true })
    .to(certFile);
  shelljs.rm(csrFile);
  console.log(`  -> Generated certificate in ${certFile}`);
} else {
  console.log("  -> Skipping due to dry run");
}
