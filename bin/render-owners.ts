import fs from "fs";
import handlebars from "handlebars";
import glob from "glob";
import * as schemas from "../lib/schemas";
import { hbsSeparator } from "../lib/hbs-helpers";
import { renderTemplateMap } from "../lib/templates";
import { validateYamlFile } from "../lib/validations";
import { getProjectOwnersFile } from "../lib/consts";
import { logArgv } from "../lib/utils";
import { ProjectOwners } from "../lib/interfaces";
import stages from "../lib/stages";

// Cmd
logArgv();

// Get a list of projects
const projectFolders = glob.sync("projects/*");
hbsSeparator(handlebars);

// Parse and validate configs
const projectOwners = projectFolders.reduce((value, projectFolder) => {
  const project = projectFolder.split("/")[1];
  const ownersConfigFile = getProjectOwnersFile(project);
  if (fs.existsSync(ownersConfigFile)) {
    console.log(`Validating ${ownersConfigFile}...`);
    const data = validateYamlFile(ownersConfigFile, schemas.schemaInfoYaml);
    console.log(`  -> file is valid!`);
    const project = projectFolder.split("/")[1];
    return {
      ...value,
      [project]: data.owners,
    };
  }
  return { ...value };
}, {} as ProjectOwners);

const allOwners = Object.values(projectOwners).flat();
const uniqueOwners = [...new Set(allOwners)].sort(); // We sort them to get consistency

// Prepare context and rendering
const context = {
  projects: projectOwners,
  uniqueOwners,
};

// Render general templates
console.log(`Rendering stageless templates for owners...`);
renderTemplateMap(
  handlebars,
  {
    "templates/github/all_owners.hbs": "users/all_owners",
    "templates/github/codeowners.hbs": ".github/CODEOWNERS",
  },
  context
);

// Render templates specific to stage
console.log(context);
stages.forEach((stage) => {
  console.log(`Rendering templates for owners for stage ${stage}...`);
  renderTemplateMap(
    handlebars,
    {
      "templates/kubernetes/cluster-roles.hbs": `kubernetes/infra/${stage}/cluster-roles.yaml`,
    },
    context
  );
});
