import { program } from "commander";
import shelljs from "shelljs";
import { getCaFileForCluster } from "../lib/consts";
import chalk from "chalk";

// Cmd
const options = program
  .requiredOption("--cluster-id <id>")
  .requiredOption("--cluster-name <name>")
  .parse()
  .opts();
console.info(chalk.blue(process.argv.join(" ")));
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
