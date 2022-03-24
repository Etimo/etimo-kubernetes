import { program } from "commander";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import * as schemas from "../lib/schemas";
import stages from "../lib/stages";
import glob from "glob";
import { validateYamlFile } from "../lib/validations";
import { getYamlContentParsed, getFileContent } from "../lib/file";
import { renderToFile } from "../lib/templates";
import { logArgv } from "../lib/utils";
import {
  getKubernetesProjectYamlFile,
  getProjectOwnersFile,
} from "../lib/consts";

const options = program.option("--dry-run").parse().opts();
logArgv();
const dryRun = options.dryRun || process.env["DRY_RUN"] === "1";

const projectFolders = glob.sync("projects/*");

// Parse and validate stage configs
projectFolders.forEach((projectFolder) => {
  const project = projectFolder.split("/")[1];
  console.log(`Validating project name ${project}...`);
  schemas.assertValidData(project, schemas.schemaProjectName);
  console.log("  -> project name is valid!");
  const ownersFile = getProjectOwnersFile(project);

  // Validate owners file
  console.log(`Validating ${ownersFile}...`);
  validateYamlFile(ownersFile, schemas.schemaOwners);
  console.log(`  -> file is valid!`);

  // Validate each stage file
  stages.forEach((stage) => {
    const stageConfigFile = path.join(projectFolder, stage + ".yaml");
    if (fs.existsSync(stageConfigFile)) {
      console.log(`Validating ${stageConfigFile}...`);
      validateYamlFile(stageConfigFile, schemas.schemaProjectStage, {
        project,
      });
      console.log(`  -> file is valid!`);
    }
  });
});

// Perform action
projectFolders.forEach((projectFolder) => {
  const project = projectFolder.split("/")[1];
  const ownersFile = getProjectOwnersFile(project);
  const ownersData = getYamlContentParsed(ownersFile);
  const stageYamlData = stages.map((stage) => {
    const stageConfigFile = path.join(projectFolder, stage + ".yaml");
    if (fs.existsSync(stageConfigFile)) {
      return {
        ...getYamlContentParsed(stageConfigFile),
        project,
        ...ownersData,
      };
    }
    return null;
  });

  stageYamlData.forEach((stageData, index) => {
    if (stageData) {
      const stage = stages[index];
      const templates: Record<string, string> = {
        "templates/terraform/project_main.hbs":
          "terraform/project_" + project + "_" + stage + ".tf",
        [`templates/kubernetes/project.${stage}.hbs`]:
          getKubernetesProjectYamlFile(project, stage),
      };
      console.log(
        `Rendering templates for project ${project} stage ${stage}...`
      );
      Object.keys(templates).map((key) => {
        const dest = templates[key];
        const template = handlebars.compile(getFileContent(key));

        if (!dryRun) {
          const context = {
            ...stageData,
            stage,
          };
          renderToFile(template, context, dest);
          console.log(`  -> Rendered template to ${dest}!`);
        } else {
          console.log("  (Skipping rendering due to dryn run)");
        }
      });
    }
  });
});
