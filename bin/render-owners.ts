import { program } from "commander";
import fs from "fs";
import handlebars from "handlebars";
import glob from "glob";
import * as schemas from "../lib/schemas";
import { hbsSeparator } from "../lib/hbs-helpers";
import { getTemplate, renderToFile } from "../lib/templates";
import { validateYamlFile } from "../lib/validations";
import { getProjectOwnersFile } from "../lib/consts";
import { logArgv } from "../lib/utils";

// Cmd
const options = program.option("--dry-run").parse().opts();
logArgv();
const dryRun = options.dryRun || process.env["DRY_RUN"] === "1";

// Get a list of projects
const projectFolders = glob.sync("projects/*");
hbsSeparator(handlebars);

// Parse and validate stage configs
interface ProjectOwners {
  [key: string]: string[];
}
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
}, {} as ProjectOwners);

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
interface Owners {
  [key: string]: boolean;
}
const currentOwners = allOwners.reduce(
  (total, value) => ({
    ...total,
    [value]: true,
  }),
  {} as Owners
);

if (!dryRun) {
  fs.writeFileSync(allOwnersFile, Object.keys(currentOwners).sort().join("\n"));
  console.log(`  -> Rendered all_owners!`);
} else {
  console.log("  (Skipping rendering due to dry run)");
}
