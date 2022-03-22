import shelljs from "shelljs";

export interface TerraformString {
  value: string[];
}

export interface TerraformOutput {
  cluster_endpoints: TerraformString;
  cluster_ids: TerraformString;
  cluster_names: TerraformString;
  stages: TerraformString;
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

export interface Cluster {
  clusterId: string;
  clusterName: string;
  clusterEndpoint: string;
  stage: string;
}

export interface AppliedMigration {
  checksum: string;
  ts: string;
}
export interface AppliedMigrations {
  [key: string]: AppliedMigration;
}

export type Clusters = Array<Cluster>;

export type KubeCtlWithContext = (
  cmd: string,
  options?: shelljs.ExecOptions
) =>
  | shelljs.ExecOutputReturnValue
  | shelljs.ShellArray
  | shelljs.ShellString
  | shelljs.ShellReturnValue;
