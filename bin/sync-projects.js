const { program } = require("commander");
const shelljs = require("shelljs");
const { getAllProjects } = require("../lib/projects");
const { getAllNamespaces } = require("../lib/kubernetes");

// Cmd
const options = program.option("--dry-run").parse().opts();
const dryRun = options.dryRun;

// Get total list of projects
console.log("Getting current from projects in repo...");
const existingProjects = getAllProjects();

// Get users already in k8s
console.log("Getting existing namespaces from kubernetes...");
const namespaces = getAllNamespaces();

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
