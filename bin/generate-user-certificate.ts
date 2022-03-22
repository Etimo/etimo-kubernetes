import { program } from "commander";
import shelljs from "shelljs";
import * as schemas from "../lib/schemas";
import {
  getCertFileForUsername,
  getCsrOutputFileForUsername,
} from "../lib/consts";
import { assertFile, getTempFilename, setFileContent } from "../lib/file";
import * as consts from "../lib/consts";
import { getContext, getKubectlForContext } from "../lib/kubernetes";

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
    `ts-node ./bin/generate-csr.ts --username ${username} --stage ${stage}`
  );
  shelljs.exec(`yarn render:csr --username ${username} --stage ${stage}`);
  kubectlWithContext(`apply -f ${csrOutputFile}`);
  kubectlWithContext(`certificate approve ${username}`);
  const tempfile = getTempFilename();
  const res = kubectlWithContext(
    `get csr ${username} -o jsonpath='{.status.certificate}'`,
    {
      silent: true,
    }
  );
  setFileContent(tempfile, res.stdout);
  shelljs.cat(tempfile).exec(`base64 --decode`, { silent: true }).to(certFile);
  console.log(`  -> Generated certificate in ${certFile}`);
} else {
  console.log("  -> Skipping due to dry run");
}
