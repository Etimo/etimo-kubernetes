const { program } = require("commander");
const shelljs = require("shelljs");
const fs = require("fs");
const glob = require("glob");
const consts = require("../lib/consts");
const nodemailer = require("nodemailer");

// Cmd
const options = program.option("--dry-run").parse().opts();
const dryRun = options.dryRun;

console.log("Getting current from projects in repo...");
const existingProjects = new Set(
  glob.sync("projects/*", {}).map((p) => p.split("/")[1])
);

// Get users already in k8s
console.log("Getting existing namespaces from kubernetes...");
const res = shelljs.exec(
  "kubectl get namespace --selector provisioner=etimo-kubernetes",
  { silent: true }
);
if (res.code !== 0) {
  console.error("Unable to get namespaces in kubernetes.");
  process.exit(1);
}
const namespaces = new Set(
  res.stdout
    .split("\n")
    .filter((s) => s.length > 0)
    .slice(1)
    .map((s) => s.split(" ")[0])
);

console.log("Projects in repo:", existingProjects);
console.log("Namespaces in kubernetes:", namespaces);

const namespacesToAdd = new Set(
  [...existingProjects].filter((u) => !namespaces.has(u))
);
const namespacesToRemove = new Set(
  [...namespaces].filter((u) => !existingProjects.has(u))
);
console.log("Namespaces to add/update to kubernetes:", namespacesToAdd);
console.log("Namespaces to remove from kubernetes:", namespacesToRemove);

if (!dryRun) {
  console.log(`Creating or updating project namespaces...`);
  shelljs.exec(`kubectl apply -f kubernetes/projects/`);
  namespacesToRemove.forEach((ns) => {
    console.log(`Removing namespace ${ns}...`);
    shelljs.exec(`kubectl delete namespace ${ns}`);
  });
} else {
  console.log("  -> Not applying changes because of dry run");
}
