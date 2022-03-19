const { program } = require("commander");
const shelljs = require("shelljs");
const { getTotalUsers } = require("../lib/projects");
const { getAllUsers } = require("../lib/kubernetes");

// Cmd
const options = program.option("--dry-run").parse().opts();
const dryRun = options.dryRun;

// Get total list of users in all projects
console.log("Getting users from projects in repo...");
const existingUsersMap = getTotalUsers();

// Get users already in k8s
console.log("Getting existing users from kubernetes...");
const kubernetesUsers = getAllUsers();
console.log("Users in projects:", existingUsersMap);
console.log("Users in kubernetes:", kubernetesUsers);

// Calculate users to add and remove
const usersToAdd = new Set(
  [...existingUsersMap].filter((u) => !kubernetesUsers.has(u))
);
const usersToRemove = new Set(
  [...kubernetesUsers].filter((u) => !existingUsersMap.has(u))
);
console.log("Users to add to kubernetes:", usersToAdd);
console.log("Users to remove from kubernetes:", usersToRemove);

if (!dryRun) {
  // Perform sync
  usersToAdd.forEach((username) => {
    console.log(`Generating certificate for ${username}...`);
    shelljs.exec(`./bin/generate-user-certificate.js --username ${username}`);
  });
  usersToRemove.forEach((username) => {
    console.log(`Removing user certificate for ${username}...`);
    shelljs.exec(`kubectl delete csr ${username}`);
  });
} else {
  console.log("  -> Not applying users because of dry run");
}
