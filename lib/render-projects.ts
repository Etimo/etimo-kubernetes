import path from "path";
import fs from "fs";
import * as schemas from "../lib/schemas";
import glob from "glob";
import { validateYamlFile } from "../lib/validations";
import { getYamlContentParsed } from "../lib/file";
import { renderTemplateMap } from "../lib/templates";
import { getProjectOwnersFile } from "../lib/consts";
import {
  IClusterInfo,
  Owners,
  ProjectDefinition,
  ProjectStageCallback,
  StageCallback,
  TemplateMap,
} from "../lib/interfaces";
import { getTerraformSafeVariableName } from "../lib/terraform";
import {
  getConfigMapFromClusterInfoProject,
  getSecretsFromClusterInfoProject,
} from "../lib/projects";
import stages from "../lib/stages";

export const renderProjects = (
  handlebars: any,
  templatesPerProjectStage: ProjectStageCallback<TemplateMap>,
  templatesPerStage: StageCallback<TemplateMap>,
  clusterInfo?: IClusterInfo
) => {
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
          configMap: clusterInfo
            ? getConfigMapFromClusterInfoProject(
                clusterInfo[index].projects.find((p) => p.name === project)
              )
            : null,
          secrets: clusterInfo
            ? getSecretsFromClusterInfoProject(
                clusterInfo[index].projects.find((p) => p.name === project)
              )
            : null,
          stage,
        };
        resources[stage].hasAnyBuckets ||= stageData.buckets.length > 0;
        resources[stage].hasAnySharedDatabases ||= databases.length > 0;
        renderTemplateMap(
          handlebars,
          templatesPerProjectStage(project, stage),
          context
        );
      }
    });
  });

  // Render terraform for stages
  stages.forEach((stage, index) => {
    console.log(`Rendering templates for stage ${stage}...`);
    const context = {
      ...resources[stage],
      stage,
    };
    renderTemplateMap(handlebars, templatesPerStage(stage), context);
  });
};
