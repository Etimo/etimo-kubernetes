const { program } = require("commander");
const path = require("path");
const fs = require("fs");
const yaml = require("yaml");
const handlebars = require("handlebars");
const schemas = require("../lib/schemas");

const stages = ["staging", "production"];

const options = program
  .option("--dry-run")
  .option("--project <type>")
  .parse()
  .opts();

const project = options.project;
const dryRun = options.dryRun;

// Validate project name
const projectNameValidationResult = schemas.schemaProjectName.validate(project);
if (projectNameValidationResult.error) {
  console.error(projectNameValidationResult.error);
  process.exit(1);
}

const projectFolder = path.join("projects", project);
const templates = {
  //   "templates/github/codeowners.hbs": ".github/CODEOWNERS",
  "templates/terraform/project_main.hbs":
    "terraform/project_" + project + "_staging.tf",
};

handlebars.registerHelper("sep", function (options) {
  if (options.data.last) {
    return options.inverse();
  } else {
    return options.fn();
  }
});

// Parse and validate stage configs
const stageYamlData = stages.map((stage) => {
  const stageConfigFile = path.join(projectFolder, stage + ".yaml");
  if (fs.existsSync(stageConfigFile)) {
    const yamlData = fs.readFileSync(stageConfigFile).toString();
    const yamlDataParsed = yaml.parse(yamlData);
    yamlDataParsed.codename = project;
    const validationResult =
      schemas.schemaProjectStage.validate(yamlDataParsed);
    if (validationResult.error) {
      console.error(validationResult.error);
      process.exit(1);
    }
    return yamlDataParsed;
  }
  return null;
});

stageYamlData.forEach((stageData, index) => {
  if (stageData) {
    const stage = stages[index];
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
