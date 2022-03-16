const { program } = require("commander");
const path = require("path");
const fs = require("fs");
const yaml = require("yaml");
const handlebars = require("handlebars");
const glob = require("glob");

const schemas = require("../lib/schemas");
const stages = require("../lib/stages");
const { hbsSeparator } = require("../lib/hbs-helpers");

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
const templateStr = fs
  .readFileSync("templates/github/codeowners.hbs")
  .toString();
const template = handlebars.compile(templateStr);

if (!dryRun) {
  fs.writeFileSync(
    dest,
    template({
      projects: projectOwners,
    })
  );
  console.log(`  -> Rendered template to ${dest}!`);
} else {
  console.log("  (Skipping rendering due to dryn run)");
}

// const stageYamlData = stages.map((stage) => {
//   const stageConfigFile = path.join(projectFolder, stage + ".yaml");
//   if (fs.existsSync(stageConfigFile)) {
//     const yamlData = fs.readFileSync(stageConfigFile).toString();
//     const yamlDataParsed = yaml.parse(yamlData);
//     yamlDataParsed.codename = project;
//     const validationResult =
//       schemas.schemaProjectStage.validate(yamlDataParsed);
//     if (validationResult.error) {
//       console.error(validationResult.error);
//       process.exit(1);
//     }
//     return yamlDataParsed;
//   }
//   return null;
// });

// stageYamlData.forEach((stageData, index) => {
//   if (stageData) {
//     const stage = stages[index];
//     console.log(
//       `Rendering terraform template for project ${project} stage ${stage}...`
//     );
//     Object.keys(templates).map((key) => {
//       const dest = templates[key];
//       const templateStr = fs.readFileSync(key).toString();
//       const template = handlebars.compile(templateStr);

//       if (!dryRun) {
//         fs.writeFileSync(
//           dest,
//           template({
//             ...stageData,
//             stage,
//           })
//         );
//         console.log(`  -> Rendered template to ${dest}!`);
//       } else {
//         console.log("  (Skipping rendering due to dryn run)");
//       }
//     });
//   }
// });
