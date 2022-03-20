const { program } = require("commander");
const shelljs = require("shelljs");
const { getCaFileForCluster } = require("../lib/consts");

// Cmd
const options = program
  .requiredOption("--cluster-id <id>")
  .requiredOption("--cluster-name <name>")
  .parse()
  .opts();
const clusterName = options.clusterName;
const clusterId = options.clusterId;
const caFile = getCaFileForCluster(clusterName);

// Perform
console.log(`Extracting CA from ${clusterName} (${clusterId})...`);
shelljs.config.silent = true;
shelljs
  .exec(`doctl kubernetes cluster kubeconfig show ${clusterId}`)
  .grep(`certificate-authority-data`)
  .exec(`awk -F': ' '{print $2}'`)
  .exec("base64 -d")
  .to(caFile);
console.log(`  -> Wrote ${caFile}`);
