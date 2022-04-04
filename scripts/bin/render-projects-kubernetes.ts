import handlebars from "handlebars";
import { logArgv } from "../lib/utils";
import {
  getKubernetesProjectNamespaceYamlFile,
  getKubernetesProjectSecretsYamlFile,
  getKubernetesProjectYamlFile,
} from "../lib/consts";
import { readClusterInfo } from "../lib/cluster-info";
import { hbsSeparator, registerPartialDb } from "../lib/hbs-helpers";
import { renderProjects } from "../lib/render-projects";

logArgv();

registerPartialDb(handlebars);
hbsSeparator(handlebars);

const clusterInfo = readClusterInfo();

// // Parse and validate stage configs
// projectFolders.forEach((projectFolder) => {
//   const project = projectFolder.split("/")[1];
//   console.log(`Validating project name ${project}...`);
//   schemas.assertValidData(project, schemas.schemaProjectName);
//   console.log("  -> project name is valid!");
//   const ownersFile = getProjectOwnersFile(project);

//   // Validate owners file
//   console.log(`Validating ${ownersFile}...`);
//   validateYamlFile(ownersFile, schemas.schemaInfoYaml);
//   console.log(`  -> file is valid!`);

//   // Validate each stage file
//   stages.forEach((stage) => {
//     const stageConfigFile = path.join(projectFolder, stage + ".yaml");
//     if (fs.existsSync(stageConfigFile)) {
//       console.log(`Validating ${stageConfigFile}...`);
//       validateYamlFile(stageConfigFile, schemas.schemaProjectStageYaml, {
//         project,
//       });
//       console.log(`  -> file is valid!`);
//     }
//   });
// });

// // Perform action
// interface StageOverallResources {
//   [key: string]: /* stage */ {
//     hasAnySharedDatabases: boolean;
//     hasAnyBuckets: boolean;
//   };
// }
// const resources = stages.reduce(
//   (total, s) => ({
//     ...total,
//     [s]: {
//       hasAnySharedDatabases: false,
//       hasAnyBuckets: false,
//     },
//   }),
//   {} as StageOverallResources
// );
// projectFolders.forEach((projectFolder) => {
//   const project = projectFolder.split("/")[1];
//   const ownersFile = getProjectOwnersFile(project);
//   const ownersData = getYamlContentParsed<Owners>(ownersFile);
//   const stageYamlData = stages.map((stage) => {
//     const stageConfigFile = path.join(projectFolder, stage + ".yaml");
//     if (fs.existsSync(stageConfigFile)) {
//       return {
//         ...getYamlContentParsed<ProjectDefinition>(stageConfigFile),
//         project,
//         ...ownersData,
//       };
//     }
//     return null;
//   });

//   stageYamlData.forEach((stageData, index) => {
//     if (stageData) {
//       const stage = stages[index];
//       const templates: TemplateMap = {
//         [`templates/kubernetes/project.${stage}.hbs`]:
//           getKubernetesProjectYamlFile(project, stage),
//         [`templates/kubernetes/project-namespace.${stage}.hbs`]:
//           getKubernetesProjectNamespaceYamlFile(project, stage),
//         [`templates/kubernetes/project-secrets.${stage}.hbs`]:
//           getKubernetesProjectSecretsYamlFile(project, stage),
//       };
//       console.log(
//         `Rendering templates for project ${project} stage ${stage}...`
//       );
//       const databases = stageData.databases ?? [];
//       const buckets = stageData.buckets ?? [];
//       const context = {
//         ...stageData,
//         databaseClusters: databases.filter((d) => !d.shared),
//         sharedDatabases: databases.filter((d) => d.shared),
//         tfName: getTerraformSafeVariableName(project) + "_" + stage,
//         configMap: clusterInfo
//           ? getConfigMapFromClusterInfoProject(
//               clusterInfo[index].projects.find((p) => p.name === project)
//             )
//           : null,
//         secrets: clusterInfo
//           ? getSecretsFromClusterInfoProject(
//               clusterInfo[index].projects.find((p) => p.name === project)
//             )
//           : null,
//         stage,
//       };
//       resources[stage].hasAnyBuckets ||= stageData.buckets.length > 0;
//       resources[stage].hasAnySharedDatabases ||= databases.length > 0;
//       renderTemplateMap(handlebars, templates, context);
//     }
//   });
// });

// // Render terraform for stages
// stages.forEach((stage, index) => {
//   // const templates: Record<string, string> = {
//   //   "templates/terraform/stage_main.hbs": "terraform/stage_" + stage + ".tf",
//   // };
//   // console.log(`Rendering templates for stage ${stage}...`);
//   // const context = {
//   //   ...resources[stage],
//   //   stage,
//   // };
//   // renderTemplateMap(handlebars, templates, context);
// });

renderProjects(
  handlebars,
  (project, stage) => ({
    [`templates/kubernetes/project.${stage}.hbs`]: getKubernetesProjectYamlFile(
      project,
      stage
    ),
    [`templates/kubernetes/project-namespace.${stage}.hbs`]:
      getKubernetesProjectNamespaceYamlFile(project, stage),
    [`templates/kubernetes/project-secrets.${stage}.hbs`]:
      getKubernetesProjectSecretsYamlFile(project, stage),
  }),
  (stage) => ({}),
  clusterInfo
);
