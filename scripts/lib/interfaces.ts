import shelljs from "shelljs";

export type TemplateMap = Record<string, string>;
export type ProjectStageCallback<T> = (project: string, stage: string) => T;
export type StageCallback<T> = (stage: string) => T;
export type ProjectCallback<T> = (project: string) => T;

export interface TerraformString {
  value: string[];
}

export type DatabaseType = "pg";

export interface Database {
  name: string;
  type: DatabaseType;
  shared: boolean;
}

export interface ProjectDefinition {
  buckets: string[];
  databases: Database[];
}

export type ProjectStageDefinition = ProjectDefinition & {
  stage: string;
};

export interface TerraformClusterOutput {
  cluster_endpoints: TerraformString;
  cluster_ids: TerraformString;
  cluster_names: TerraformString;
  stages: TerraformString;
}
export interface TerraformDatabaseCluster {
  host: string;
  name: string;
  port: number;
  private_host: string;
  user: string;
  password: string;
  ca: string;
}
export type TerraformOutput = TerraformClusterOutput & TerramformProjectOutput;
export interface TerraformDatabaseUser {
  name: string;
  password: string;
}

export interface TerramformProjectOutput {
  [project: string]: {
    value: {
      database_clusters: {
        [dbName: string]: TerraformDatabaseCluster;
      };
      shared_databases: {
        [dbName: string]: TerraformDatabaseCluster;
      };
      shared_databases_users: {
        [dbName: string]: TerraformDatabaseUser;
      };
      project: string;
      stage: string;
    };
  };
}

export interface ProjectOwners {
  [key: string]: string[];
}

export interface Owners {
  [key: string]: boolean;
}

export interface UserAttachments {
  [key: string]: string;
}

export interface TotalAttachments {
  [key: string]: string[];
}

export interface IClusterDatabase {
  key: string;
  name: string;
  user: string;
  password: string;
  port: number;
  host: string;
  privateHost: string;
  ca?: string;
}

export interface IClusterProject {
  name: string;
  databases: IClusterDatabase[];
}

export interface ICluster {
  clusterId: string;
  clusterName: string;
  clusterEndpoint: string;
  stage: string;
  projects: IClusterProject[];
}

export interface AppliedMigration {
  checksum: string;
  ts: string;
}
export interface AppliedMigrations {
  [key: string]: AppliedMigration;
}

export type IClusterInfo = Array<ICluster>;

export type KubeCtlWithContext = (
  cmd: string,
  options?: shelljs.ExecOptions
) =>
  | shelljs.ExecOutputReturnValue
  | shelljs.ShellArray
  | shelljs.ShellString
  | shelljs.ShellReturnValue;

export interface Employee {
  githubUsername: string;
  username: string;
  firstName: string;
}
