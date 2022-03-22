import { program } from "commander";
import { getAllProjectsForStage } from "../lib/projects";
import {
  getAllNamespaces,
  getContext,
  getKubectlForContext,
} from "../lib/kubernetes";
import { readClusterInfo } from "../lib/cluster-info";
import { assertFile } from "../lib/file";
import * as consts from "../lib/consts";
import { getKubernetesProjectYamlFile } from "../lib/consts";
import { logArgv } from "../lib/utils";

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
