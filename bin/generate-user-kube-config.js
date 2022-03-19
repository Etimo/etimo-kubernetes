const { program } = require("commander");
const shelljs = require("shelljs");
const consts = require("../lib/consts");
const { readClusterInfo } = require("../lib/cluster-info");
const schemas = require("../lib/schemas");
const { assertValidData } = require("../lib/templates");
const {
  getCertFileForUsername,
  getKeyFileForUsername,
  getKubeconfigFileForUsername,
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
const keyFile = getKeyFileForUsername(username);
const kubeconfigFile = getKubeconfigFileForUsername(username);

// Validation
assertValidData(username, schemas.schemaGithubUsername);
assertFile(certFile, true);
assertFile(keyFile, true);
assertFile(consts.FILENAME_CLUSTER_INFO, true);

// Perform
const clusterInfo = readClusterInfo();
clusterInfo.forEach((cluster) => {
  console.log(`Generating kubeconfig for cluster ${cluster.clusterName}...`);
  if (!dryRun) {
    shelljs.exec(
      `kubectl config set-cluster ${cluster.clusterName} --server=${cluster.clusterEndpoint} --certificate-authority=ca.${cluster.clusterName}.crt --kubeconfig=${kubeconfigFile} --embed-certs`
    );
    shelljs.exec(
      `kubectl config set-credentials ${username} --client-certificate=${certFile} --client-key=${keyFile} --embed-certs --kubeconfig=${kubeconfigFile}`
    );
    shelljs.exec(
      `kubectl config set-context ${cluster.clusterName} --cluster=${cluster.clusterName} --user=${username} --kubeconfig=${kubeconfigFile}`
    );
    shelljs.exec(
      `kubectl --kubeconfig ${kubeconfigFile} config use-context ${cluster.clusterName}`
    );
  } else {
    console.log("  -> Skipping because of dry run");
  }
});

if (!dryRun) {
  console.log(`Generated kubeconfig for ${username}: ${kubeconfigFile}`);
}
