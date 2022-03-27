import { program } from "commander";
import { getAllProjectNamesForStage } from "../lib/projects";
import {
  getAllNamespaces,
  getContext,
  getKubectlForContext,
} from "../lib/kubernetes";
import { readClusterInfo } from "../lib/cluster-info";
import { assertFile } from "../lib/file";
import * as consts from "../lib/consts";
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
  const stage = cluster.stage;
  const clusterName = cluster.clusterName;
  const kubectlWithContext = getKubectlForContext(getContext(clusterName));

  // Update infra commons
  console.log(`Creating or updating common infra setup for ${stage}...`);
  kubectlWithContext(`apply -f kubernetes/infra/${stage}/`);

  // Get total list of projects
  console.log(`Getting current projects in repo for stage ${stage}...`);
  const existingProjects = getAllProjectNamesForStage(stage);

  // Get projects already in k8s
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
    console.log(
      `Creating or updating projects from ${consts.getKubernetesProjectPath(
        stage
      )}...`
    );
    kubectlWithContext(
      `apply -f -v ${consts.getKubernetesProjectPath(stage)}/`
    );
    namespacesToRemove.forEach((ns) => {
      console.log(`Removing namespace ${ns}...`);
      kubectlWithContext(`delete namespace ${ns}`);
    });
  } else {
    console.log("  -> Not applying changes because of dry run");
  }
});
