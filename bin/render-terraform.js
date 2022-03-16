const { program } = require("commander");
const path = require("path");
const fs = require("fs");
const yaml = require("yaml");
const handlebars = require("handlebars");
const glob = require("glob");
const schemas = require("../lib/schemas");
const { hbsSeparator } = require("../lib/hbs-helpers");

const stages = require("../lib/stages");

const options = program.option("--dry-run").parse().opts();

const dryRun = options.dryRun;

const projectFolders = glob.sync("projects/*");
hbsSeparator(handlebars);

// Parse and validate stage configs
projectFolders.forEach((projectFolder) => {
  const project = projectFolder.split("/")[1];
  const stageYamlData = stages.map((stage) => {
    const stageConfigFile = path.join(projectFolder, stage + ".yaml");
    if (fs.existsSync(stageConfigFile)) {
      console.log(`Validating ${stageConfigFile}...`);
      const yamlData = fs.readFileSync(stageConfigFile).toString();
      const yamlDataParsed = yaml.parse(yamlData);
      yamlDataParsed.codename = project;
      const validationResult =
        schemas.schemaProjectStage.validate(yamlDataParsed);
      if (validationResult.error) {
        console.error(validationResult.error);
        process.exit(1);
      }
      console.log(`  -> file is valid!`);
      return yamlDataParsed;
    }
    return null;
  });

  stageYamlData.forEach((stageData, index) => {
    if (stageData) {
      const stage = stages[index];
      const templates = {
        "templates/terraform/project_main.hbs":
          "terraform/project_" + project + "_" + stage + ".tf",
      };
      console.log(
        `Rendering terraform template for project ${project} stage ${stage}...`
      );
      Object.keys(templates).map((key) => {
        const dest = templates[key];
        const templateStr = fs.readFileSync(key).toString();
        const template = handlebars.compile(templateStr);

        if (!dryRun) {
          fs.writeFileSync(
            dest,
            template({
              ...stageData,
              stage,
            })
          );
          console.log(`  -> Rendered template to ${dest}!`);
        } else {
          console.log("  (Skipping rendering due to dryn run)");
        }
      });
    }
  });
});
