const { program } = require("commander");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const glob = require("glob");

const schemas = require("../lib/schemas");
const { hbsSeparator } = require("../lib/hbs-helpers");
const { getTemplate, renderToFile } = require("../lib/templates");
const { validateYamlFile } = require("../lib/validations");
const { getProjectOwnersFile } = require("../lib/consts");

// Cmd
const options = program.option("--dry-run").parse().opts();
const dryRun = options.dryRun || process.env["DRY_RUN"] === "1";

// Get a list of projects
const projectFolders = glob.sync("projects/*");
hbsSeparator(handlebars);

// Parse and validate stage configs
const projectOwners = projectFolders.reduce((value, projectFolder) => {
  const project = projectFolder.split("/")[1];
  const ownersConfigFile = getProjectOwnersFile(project);
  console.log(ownersConfigFile);
  if (fs.existsSync(ownersConfigFile)) {
    console.log(`Validating ${ownersConfigFile}...`);
    const data = validateYamlFile(ownersConfigFile, schemas.schemaOwners);
    console.log(`  -> file is valid!`);
    const project = projectFolder.split("/")[1];
    return {
      ...value,
      [project]: data.owners,
    };
  }
  return { ...value };
}, {});

console.log(`Rendering codeowners template...`);
const dest = ".github/CODEOWNERS";

if (!dryRun) {
  const template = getTemplate(handlebars, "github", "codeowners.hbs");
  renderToFile(
    template,
    {
      projects: projectOwners,
    },
    dest
  );
  console.log(`  -> Rendered template to ${dest}!`);
} else {
  console.log("  (Skipping rendering due to dryn run)");
}

console.log("Rendering all_owners...");
const allOwners = Object.values(projectOwners).flat();
const allOwnersFile = "users/all_owners";
const currentOwners = allOwners.reduce((total, value) => {
  total[value] = true;
  return total;
}, {});

if (!dryRun) {
  fs.writeFileSync(allOwnersFile, Object.keys(currentOwners).sort().join("\n"));
  console.log(`  -> Rendered all_owners!`);
} else {
  console.log("  (Skipping rendering due to dry run)");
}
