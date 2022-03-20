const { program } = require("commander");
const shelljs = require("shelljs");
const schemas = require("../lib/schemas");
const {
  getCertFileForUsername,
  getCsrOutputFileForUsername,
} = require("../lib/consts");
const { assertFile } = require("../lib/file");
const consts = require("../lib/consts");
const { getContext, getKubectlForContext } = require("../lib/kubernetes");

// Cmd
const options = program
  .requiredOption("--username <username>")
  .requiredOption("--cluster-name <cluster_name>")
  .requiredOption("--stage <stage>")
  .option("--dry-run")
  .parse()
  .opts();
const username = options.username;
const dryRun = options.dryRun || process.env["DRY_RUN"] === "1";
const stage = options.stage;
const clusterName = options.clusterName;
const certFile = getCertFileForUsername(username, stage);
const csrOutputFile = getCsrOutputFileForUsername(username, stage);
const context = getContext(clusterName);
const kubectlWithContext = getKubectlForContext(context);

// Validate
schemas.assertValidData(username, schemas.schemaGithubUsername);
assertFile(consts.FILENAME_CLUSTER_INFO, true);

// Perform
if (!dryRun) {
  console.log(`Generating certificate for ${username}...`);
  shelljs.exec(
    `node ./bin/generate-csr.js --username ${username} --stage ${stage}`
  );
  shelljs.exec(`yarn render:csr --username ${username} --stage ${stage}`);
  kubectlWithContext(`apply -f ${csrOutputFile}`);
  kubectlWithContext(`certificate approve ${username}`);
  kubectlWithContext(
    `get csr ${username} -o jsonpath='{.status.certificate}'`,
    {
      silent: true,
    }
  )
    .exec(`base64 --decode`, { silent: true })
    .to(certFile);
  console.log(`  -> Generated certificate in ${certFile}`);
} else {
  console.log("  -> Skipping due to dry run");
}
