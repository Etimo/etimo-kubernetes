const { program } = require("commander");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const schemas = require("../lib/schemas");
const stages = require("../lib/stages");
const glob = require("glob");
const { validateYamlFile } = require("../lib/validations");
const { getYamlContentParsed, getFileContent } = require("../lib/file");
const { renderToFile } = require("../lib/templates");

const options = program.option("--dry-run").parse().opts();
const dryRun = options.dryRun || process.env["DRY_RUN"] === "1";

const projectFolders = glob.sync("projects/*");

// Parse and validate stage configs
projectFolders.forEach((projectFolder) => {
  const project = projectFolder.split("/")[1];
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
  const stageYamlData = stages.map((stage) => {
    const stageConfigFile = path.join(projectFolder, stage + ".yaml");
    if (fs.existsSync(stageConfigFile)) {
      return { ...getYamlContentParsed(stageConfigFile), project };
    }
    return null;
  });

  stageYamlData.forEach((stageData, index) => {
    if (stageData) {
      const stage = stages[index];
      const templates = {
        "templates/terraform/project_main.hbs":
          "terraform/project_" + project + "_" + stage + ".tf",
        "templates/kubernetes/project.hbs":
          "kubernetes/projects/" + project + "_" + stage + ".yaml",
      };
      console.log(
        `Rendering templates for project ${project} stage ${stage}...`
      );
      Object.keys(templates).map((key) => {
        const dest = templates[key];
        const template = handlebars.compile(getFileContent(key));

        if (!dryRun) {
          renderToFile(
            template,
            {
              ...stageData,
              stage,
            },
            dest
          );
          console.log(`  -> Rendered template to ${dest}!`);
        } else {
          console.log("  (Skipping rendering due to dryn run)");
        }
      });
    }
  });
});
