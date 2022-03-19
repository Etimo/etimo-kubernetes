const { program } = require("commander");
const shelljs = require("shelljs");
const schemas = require("../lib/schemas");

// Cmd
const options = program.option("--dry-run").parse().opts();
const dryRun = options.dryRun;

// Get total list of users in all projects
console.log("Getting output from terraform...");
shelljs.pushd("terraform");
const terraformOutputRes = shelljs.exec("terraform output -json", {
  silent: true,
});
if (terraformOutputRes.code != 0) {
  console.error("Unable to get output from terraform.");
  process.exit(1);
}

console.log("Validation terraform output...");
const terraformOutput = JSON.parse(terraformOutputRes.stdout);
const validationResult =
  schemas.schemaTerraformOutput.validate(terraformOutput);
if (validationResult.error) {
  console.error(validationResult.error);
  process.exit(1);
}
console.log(`  -> data is valid!`);

// Extract ca from cluster
terraformOutput.cluster_id.value.forEach((id) => {
  shelljs.exec(`../bin/doctl-extract-ca.sh ${id} etimo-staging`);
});

// // Get users already in k8s
// console.log("Getting existing users from kubernetes...");
// const kubernetesUsers = getAllUsers();

// console.log("Users in projects:", existingUsersMap);
// console.log("Users in kubernetes:", kubernetesUsers);

// // Calculate users to add and remove
// const usersToAdd = new Set(
//   [...existingUsersMap].filter((u) => !kubernetesUsers.has(u))
// );
// const usersToRemove = new Set(
//   [...kubernetesUsers].filter((u) => !existingUsersMap.has(u))
// );
// console.log("Users to add to kubernetes:", usersToAdd);
// console.log("Users to remove from kubernetes:", usersToRemove);

// if (!dryRun) {
//   // Perform sync
//   usersToAdd.forEach((username) => {
//     console.log(`Generating certificate for ${username}...`);
//     shelljs.exec(`./bin/generate-user-certificate.sh ${username}`);
//   });
//   usersToRemove.forEach((username) => {
//     console.log(`Removing user certificate for ${username}...`);
//     shelljs.exec(`kubectl delete csr ${username}`);
//   });
// } else {
//   console.log("  -> Not applying users because of dry run");
// }
