import * as glob from "glob";
import * as fs from "fs";
import { FILENAME_ALL_OWNERS } from "./consts";
import { IClusterProject } from "./interfaces";
import { Base64 } from "js-base64";
import { SafeString } from "handlebars";

export const getAllProjects = () =>
  new Set(glob.sync("projects/*").map((p) => p.split("/")[1]));

export const getAllProjectNamesForStage = (stage: string) =>
  new Set(
    glob.sync(`projects/*/${stage}.yaml`, {}).map((p) => p.split("/")[1])
  );

export const getTotalUsers = () => {
  const existingUsersData = fs.readFileSync(FILENAME_ALL_OWNERS).toString();
  return new Set(existingUsersData.split("\n").filter((s) => s.length > 0));
};

const constCase = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();

export const getConfigMapFromClusterInfoProject = (
  project?: IClusterProject
) => {
  if (!project) return [];
  return [
    ...project.databases.map((d) => [
      {
        key: constCase(`DB_${d.key}_NAME`),
        value: d.name,
      },
      {
        key: constCase(`DB_${d.key}_USER`),
        value: d.user,
      },
      {
        key: constCase(`DB_${d.key}_PORT`),
        value: d.port,
      },
      {
        key: constCase(`DB_${d.key}_PUBLIC_HOST`),
        value: d.host,
      },
      {
        key: constCase(`DB_${d.key}_PRIVATE_HOST`),
        value: d.privateHost,
      },
      d.ca
        ? {
            key: constCase(`DB_${d.key}_CA`),
            value: new SafeString(d.ca),
          }
        : {},
    ]),
  ].flat();
};

export const getSecretsFromClusterInfoProject = (project?: IClusterProject) => {
  if (!project) return [];
  return [
    ...project.databases.map((d) => [
      {
        key: constCase(`DB_${d.key}_PASSWORD`),
        value: new SafeString(Base64.encode(d.password)),
      },
    ]),
  ].flat();
};

// type ProjectListCallback = (
//   info: ProjectFileInfo,
//   stages: ProjectFileStage[]
// ) => void;

// export class ProjectList {
//   public projects: Project[];

//   constructor() {
//     const projectNames = getAllProjects();
//     this.projects = [...projectNames].map((name: string) => new Project(name));
//   }
// }

// export class Project {
//   public info: ProjectFileInfo;
//   public stages: ProjectFileStage[];

//   constructor(private readonly name: string) {
//     this.info = new ProjectFileInfo(name);
//     this.stages = [new ProjectFileStage(name, "staging")];
//   }

//   validate() {
//     console.log(`Validating project name ${this.name}...`);
//     schemas.assertValidData(this.name, schemas.schemaProjectName);
//     console.log("  -> project name is valid!");
//     this.info.validate();
//     this.stages.forEach((s) => s.validate());
//   }
// }

// export class ProjectFileBase<T> {
//   constructor(protected readonly name: string) {}

//   protected getPath() {
//     return path.join("projects", this.name);
//   }

//   validate() {
//     schemas.assertValidData(this.name, schemas.schemaProjectName);
//   }
// }

// export class ProjectFileInfo extends ProjectFileBase<Owners> {
//   public data: Owners;
//   private filename: string;

//   constructor(name: string) {
//     super(name);
//     this.filename = path.join(this.getPath(), "info.yaml");
//     this.data = getYamlContentParsed(this.filename);
//   }

//   validate() {
//     super.validate();
//     console.log(`Validating ${this.filename}...`);
//     schemas.assertValidData(this.data, schemas.schemaInfoYaml);
//     console.log("  -> File is valid!");
//   }
// }

// export class ProjectFileStage extends ProjectFileBase<ProjectDefinition> {
//   public data: ProjectDefinition;
//   private filename: string;

//   constructor(name: string, private readonly stage: string) {
//     super(name);
//     this.filename = path.join(this.getPath(), this.getStageFile());
//     this.data = getYamlContentParsed(this.filename);
//   }

//   private getStageFile() {
//     return `${this.stage}.yaml`;
//   }

//   validate() {
//     console.log(`Validating ${this.filename}...`);
//     schemas.assertValidData(this.name, schemas.schemaProjectStageYaml);
//     console.log("  -> File is valid!");
//   }
// }
