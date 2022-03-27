import { program } from "commander";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import * as schemas from "../lib/schemas";
import glob from "glob";
import { validateYamlFile } from "../lib/validations";
import { getYamlContentParsed, getFileContent, assertFile } from "../lib/file";
import { renderToFile } from "../lib/templates";
import { logArgv } from "../lib/utils";
import {
  FILENAME_CLUSTER_INFO,
  getKubernetesProjectYamlFile,
  getProjectOwnersFile,
} from "../lib/consts";
import { readClusterInfo } from "../lib/cluster-info";
import { Owners, ProjectDefinition } from "../lib/interfaces";
import { hbsSeparator, registerPartialDb } from "../lib/hbs-helpers";
import { getTerraformSafeVariableName } from "../lib/terraform";
import {
  getConfigMapFromClusterInfoProject,
  getSecretsFromClusterInfoProject,
} from "../lib/projects";

const options = program.option("--dry-run").parse().opts();
logArgv();
const dryRun = options.dryRun || process.env["DRY_RUN"] === "1";

assertFile(FILENAME_CLUSTER_INFO, true);
registerPartialDb(handlebars);
hbsSeparator(handlebars);

const projectFolders = glob.sync("projects/*");
const clusterInfo = readClusterInfo();
const stages = clusterInfo.map((c) => c.stage);
console.log("Stages", stages);

// Parse and validate stage configs
projectFolders.forEach((projectFolder) => {
  const project = projectFolder.split("/")[1];
  console.log(`Validating project name ${project}...`);
  schemas.assertValidData(project, schemas.schemaProjectName);
  console.log("  -> project name is valid!");
  const ownersFile = getProjectOwnersFile(project);

  // Validate owners file
  console.log(`Validating ${ownersFile}...`);
  validateYamlFile(ownersFile, schemas.schemaInfoYaml);
  console.log(`  -> file is valid!`);

  // Validate each stage file
  stages.forEach((stage) => {
    const stageConfigFile = path.join(projectFolder, stage + ".yaml");
    if (fs.existsSync(stageConfigFile)) {
      console.log(`Validating ${stageConfigFile}...`);
      validateYamlFile(stageConfigFile, schemas.schemaProjectStageYaml, {
        project,
      });
      console.log(`  -> file is valid!`);
    }
  });
});

// Perform action
interface StageOverallResources {
  [key: string]: /* stage */ {
    hasAnySharedDatabases: boolean;
    hasAnyBuckets: boolean;
  };
}
const resources = stages.reduce(
  (total, s) => ({
    ...total,
    [s]: {
      hasAnySharedDatabases: false,
      hasAnyBuckets: false,
    },
  }),
  {} as StageOverallResources
);
projectFolders.forEach((projectFolder) => {
  const project = projectFolder.split("/")[1];
  const ownersFile = getProjectOwnersFile(project);
  const ownersData = getYamlContentParsed<Owners>(ownersFile);
  const stageYamlData = stages.map((stage) => {
    const stageConfigFile = path.join(projectFolder, stage + ".yaml");
    if (fs.existsSync(stageConfigFile)) {
      return {
        ...getYamlContentParsed<ProjectDefinition>(stageConfigFile),
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
      const databases = stageData.databases ?? [];
      const buckets = stageData.buckets ?? [];
      const context = {
        ...stageData,
        databaseClusters: databases.filter((d) => !d.shared),
        sharedDatabases: databases.filter((d) => d.shared),
        tfName: getTerraformSafeVariableName(project) + "_" + stage,
        configMap: getConfigMapFromClusterInfoProject(
          clusterInfo[index].projects.find((p) => p.name === project)
        ),
        secrets: getSecretsFromClusterInfoProject(
          clusterInfo[index].projects.find((p) => p.name === project)
        ),
        stage,
      };
      resources[stage].hasAnyBuckets ||= stageData.buckets.length > 0;
      resources[stage].hasAnySharedDatabases ||= databases.length > 0;
      console.log(context);
      Object.keys(templates).map((key) => {
        const dest = templates[key];
        const template = handlebars.compile(getFileContent(key));

        if (!dryRun) {
          renderToFile(template, context, dest);
          console.log(`  -> Rendered template to ${dest}!`);
        } else {
          console.log("  (Skipping rendering due to dryn run)");
        }
      });
    }
  });
});
console.log(resources);
// // Prepare overall data for each stage
// const preparedTotalDataPerStage = stages.map((stage) => {
//   const projectsForStage = totalDataForProjectPerStage.filter((project) =>
//     project.filter((projectStage) => projectStage?.stage === stage)
//   )[0];
//   console.log(projectsForStage);
//   // Do we have any databases?
//   const hasSharedDatabase = projectsForStage.some((data) =>
//     (data?.databases || []).some((d) => d.shared)
//   );
//   const hasBuckets = projectsForStage.some(
//     (data) => (data?.buckets || []).length > 0
//   );
//   return {
//     projects: [...projectsForStage],
//     stage,
//     hasBuckets,
//     hasSharedDatabase,
//   };
// });
// console.log(
//   "Prepared data",
//   JSON.stringify(preparedTotalDataPerStage, null, 2)
// );

// Render terraform for stages
stages.forEach((stage, index) => {
  const templates: Record<string, string> = {
    "templates/terraform/stage_main.hbs": "terraform/stage_" + stage + ".tf",
  };
  console.log(`Rendering templates for stage ${stage}...`);
  const context = {
    ...resources[stage],
    stage,
  };
  Object.keys(templates).map((key) => {
    const dest = templates[key];
    const template = handlebars.compile(getFileContent(key));

    if (!dryRun) {
      renderToFile(template, context, dest);
      console.log(`  -> Rendered template to ${dest}!`);
    } else {
      console.log("  (Skipping rendering due to dryn run)");
    }
  });
});
