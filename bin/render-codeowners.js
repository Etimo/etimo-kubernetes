const { program } = require("commander");
const path = require("path");
const fs = require("fs");
const yaml = require("yaml");
const handlebars = require("handlebars");
const glob = require("glob");

const schemas = require("../lib/schemas");
const stages = require("../lib/stages");
const { hbsSeparator } = require("../lib/hbs-helpers");
const { getTemplate, renderToFile } = require("../lib/templates");

// Cmd
const options = program.option("--dry-run").parse().opts();
const dryRun = options.dryRun;

// Get a list of projects
const projectFolders = glob.sync("projects/*");
hbsSeparator(handlebars);

// Parse and validate stage configs
const projectOwners = projectFolders.reduce((value, projectFolder) => {
  const ownersConfigFile = path.join(projectFolder, "owners.yaml");
  if (fs.existsSync(ownersConfigFile)) {
    console.log(`Validating ${ownersConfigFile}...`);
    const yamlData = fs.readFileSync(ownersConfigFile).toString();
    const yamlDataParsed = yaml.parse(yamlData);
    const validationResult = schemas.schemaOwners.validate(yamlDataParsed);
    if (validationResult.error) {
      console.error(validationResult.error);
      process.exit(1);
    }
    console.log(`  -> file is valid!`);
    const project = projectFolder.split("/")[1];
    return { ...value, [project]: yamlDataParsed.owners };
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

const allOwners = Object.values(projectOwners).flat();
const allOwnersNoDuplicates = allOwners.reduce((total, value) => {
  total[value] = true;
  return total;
}, {});
fs.writeFileSync(
  "projects/all_owners",
  Object.keys(allOwnersNoDuplicates).sort().join("\n")
);
