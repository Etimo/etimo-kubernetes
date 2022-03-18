const { program } = require("commander");
const shelljs = require("shelljs");
const fs = require("fs");
const consts = require("../lib/consts");
const nodemailer = require("nodemailer");

// Cmd
const options = program.option("--dry-run").parse().opts();
const dryRun = options.dryRun;

console.log("Getting users from projects in repo...");
const existingUsersData = fs
  .readFileSync(consts.FILENAME_ALL_OWNERS)
  .toString();
const existingUsersMap = new Set(
  existingUsersData.split("\n").filter((s) => s.length > 0)
);

// Get users already in k8s
console.log("Getting existing users from kubernetes...");
const res = shelljs.exec("kubectl get csr", { silent: true });
if (res.code !== 0) {
  console.error("Unable to get users in kubernetes.");
  process.exit(1);
}
const kubernetesUsers = new Set(
  res.stdout
    .split("\n")
    .filter((s) => s.length > 0)
    .slice(1)
    .map((s) => s.split(" ")[0])
);

console.log("Users in projects:", existingUsersMap);
console.log("Users in kubernetes:", kubernetesUsers);

const usersToAdd = new Set(
  [...existingUsersMap].filter((u) => !kubernetesUsers.has(u))
);
const usersToRemove = new Set(
  [...kubernetesUsers].filter((u) => !existingUsersMap.has(u))
);
console.log("Users to add to kubernetes:", usersToAdd);
console.log("Users to remove from kubernetes:", usersToRemove);

if (!dryRun) {
  usersToAdd.forEach((username) => {
    console.log(`Generating certificate for ${username}...`);
    shelljs.exec(`./bin/generate-user-certificate.sh ${username}`);
  });
  usersToRemove.forEach((username) => {
    console.log(`Removing user certificate for ${username}...`);
    shelljs.exec(`kubectl delete csr ${username}`);
  });
} else {
  console.log("  -> Not applying users because of dry run");
}
