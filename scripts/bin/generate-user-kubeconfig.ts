import { program } from "commander";
import shelljs from "shelljs";
import * as consts from "../lib/consts";
import { getClusterInfoForStage } from "../lib/cluster-info";
import * as schemas from "../lib/schemas";
import {
  getCertFileForUsername,
  getKeyFileForUsername,
  getKubeconfigFileForUsername,
  getCaFileForCluster,
} from "../lib/consts";
import { assertFile } from "../lib/file";

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
const kubeconfigFile = getKubeconfigFileForUsername(username, stage);
const keyFile = getKeyFileForUsername(username, stage);
const certFile = getCertFileForUsername(username, stage);

// Validation
schemas.assertValidData(username, schemas.schemaGithubUsername);
assertFile(consts.FILENAME_CLUSTER_INFO, true);
assertFile(keyFile, true);
assertFile(certFile, true);

// Perform
const cluster = getClusterInfoForStage(stage);
console.log(`Generating kubeconfig for cluster ${cluster.clusterName}...`);
if (!dryRun) {
  shelljs.config.silent = true;
  const caFile = getCaFileForCluster(cluster.clusterName);
  shelljs.exec(
    `kubectl config set-cluster ${cluster.clusterName} --server=${cluster.clusterEndpoint} --certificate-authority=${caFile} --kubeconfig=${kubeconfigFile} --embed-certs`
  );
  shelljs.exec(
    `kubectl config set-credentials ${username} --client-certificate=${certFile} --client-key=${keyFile} --embed-certs --kubeconfig=${kubeconfigFile}`
  );
  shelljs.exec(
    `kubectl config set-context ${cluster.clusterName} --cluster=${cluster.clusterName} --user=${username} --kubeconfig=${kubeconfigFile}`
  );
  shelljs.exec(
    `kubectl config use-context ${cluster.clusterName} --kubeconfig ${kubeconfigFile}`
  );
  console.log(`Generated kubeconfig for ${username}: ${kubeconfigFile}`);
} else {
  console.log("  -> Skipping because of dry run");
}
