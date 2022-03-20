const { program } = require("commander");
const shelljs = require("shelljs");
const { getTotalUsers } = require("../lib/projects");
const {
  getAllUsers,
  getKubectlForContext,
  getContext,
} = require("../lib/kubernetes");
const { getKubeconfigFileForUsername } = require("../lib/consts");
const { assertFile } = require("../lib/file");
const consts = require("../lib/consts");
const { readClusterInfo } = require("../lib/cluster-info");

// Cmd
const options = program.option("--dry-run").parse().opts();
const dryRun = options.dryRun;

// Validate
assertFile(consts.FILENAME_CLUSTER_INFO, true);

// Perform
console.log("Getting users from projects in repo...");
const existingUsersMap = getTotalUsers();
const clusterInfo = readClusterInfo();
clusterInfo.forEach((cluster) => {
  const stage = cluster.stage.toLowerCase();
  const clusterName = cluster.clusterName;
  const kubectlWithContext = getKubectlForContext(getContext(clusterName));

  // Get users already in k8s
  console.log(`Getting existing users from kubernetes in ${stage}...`);
  const kubernetesUsers = getAllUsers(kubectlWithContext);
  console.log("  Users in projects:", existingUsersMap);
  console.log("  Users in kubernetes:", kubernetesUsers);

  // Calculate users to add and remove
  const usersToAdd = new Set(
    [...existingUsersMap].filter((u) => !kubernetesUsers.has(u))
  );
  const usersToRemove = new Set(
    [...kubernetesUsers].filter((u) => !existingUsersMap.has(u))
  );
  console.log("  Users to add to kubernetes:", usersToAdd);
  console.log("  Users to remove from kubernetes:", usersToRemove);

  if (!dryRun) {
    // Perform sync
    usersToAdd.forEach((username) => {
      console.log(`Generating certificate for ${username}...`);
      shelljs.exec(
        `node ./bin/generate-user-certificate.js --username ${username} --cluster-name ${clusterName} --stage ${stage}`
      );
      console.log(`Generating kubeconfig for user ${username}...`);
      shelljs.exec(
        `node ./bin/generate-user-kubeconfig.js --username ${username} --stage ${stage}`
      );
      console.log(`Verifying new kubeconfig for user ${username}...`);
      const kubeconfigFile = getKubeconfigFileForUsername(username, stage);
      const res = shelljs.exec(
        `kubectl --context ${clusterName} --kubeconfig ${kubeconfigFile} version`
      );
      if (res.code !== 0) {
        // Something is wrong, delete csr so we can try again
        console.log(
          "  -> Kubeconfig is not valid! Removing user csr so it can be created again..."
        );
        kubectlWithContext(`delete csr ${username}`);
        process.exit(1);
      } else {
        console.log("  -> Kubeconfig is valid!");
        // shelljs.exec(
        //   `yarn send:kubeconfig --username ${username} --mail-username ${process.env.MAIL_USERNAME} --mail-password ${process.env.MAIL_PASSWORD}`
        // );
      }
    });
    usersToRemove.forEach((username) => {
      console.log(`Removing user certificate for ${username}...`);
      kubectlWithContext(`delete csr ${username}`);
    });
  } else {
    console.log("  -> Not applying users because of dry run");
  }
});
