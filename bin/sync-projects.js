const { program } = require("commander");
const { getAllProjectsForStage } = require("../lib/projects");
const {
  getAllNamespaces,
  getContext,
  getKubectlForContext,
} = require("../lib/kubernetes");
const stages = require("../lib/stages");
const { readClusterInfo } = require("../lib/cluster-info");
const { assertFile } = require("../lib/file");
const consts = require("../lib/consts");
const glob = require("glob");
const { getKubernetesProjectYamlFile } = require("../lib/consts");
const { logArgv } = require("../lib/utils");

// Cmd
const options = program.option("--dry-run").parse().opts();
logArgv();
const dryRun = options.dryRun || process.env["DRY_RUN"] === "1";

// Validate
assertFile(consts.FILENAME_CLUSTER_INFO, true);

// Perform
const clusterInfo = readClusterInfo();
clusterInfo.forEach((cluster) => {
  const stage = cluster.stage.toLowerCase();
  const clusterName = cluster.clusterName;
  const kubectlWithContext = getKubectlForContext(getContext(clusterName));

  // Get total list of projects
  console.log(`Getting current projects in repo for stage ${stage}...`);
  const existingProjects = getAllProjectsForStage(stage);

  // Get users already in k8s
  console.log(`Getting existing namespaces from kubernetes in ${stage}...`);
  const namespaces = getAllNamespaces(kubectlWithContext);
  console.log("Projects in repo:", existingProjects);
  console.log("Namespaces in kubernetes:", namespaces);

  // Calculate namespaces to add/remove
  const namespacesToAdd = new Set(
    [...existingProjects].filter((u) => !namespaces.has(u))
  );
  const namespacesToRemove = new Set(
    [...namespaces].filter((u) => !existingProjects.has(u))
  );
  console.log("Namespaces to add/update to kubernetes:", namespacesToAdd);
  console.log("Namespaces to remove from kubernetes:", namespacesToRemove);

  if (!dryRun) {
    // Apply sync
    console.log(`Creating or updating project namespaces...`);
    existingProjects.forEach((ns) => {
      const filename = getKubernetesProjectYamlFile(ns, stage);
      kubectlWithContext(`apply -f ${filename}`);
    });
    namespacesToRemove.forEach((ns) => {
      console.log(`Removing namespace ${ns}...`);
      kubectlWithContext(`delete namespace ${ns}`);
    });
  } else {
    console.log("  -> Not applying changes because of dry run");
  }
});
