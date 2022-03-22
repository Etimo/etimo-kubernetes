export const getCertFileForUsername = (username: string, stage: string) =>
  `temp/csr/${username}-k8s-${stage}-access.crt`;
export const getCsrFileForUsername = (username: string, stage: string) =>
  `temp/csr/${username}-k8s-${stage}.csr`;
export const getKeyFileForUsername = (username: string, stage: string) =>
  `temp/csr/${username}-k8s-${stage}.key`;
export const getEncodedCsrFileForUsername = (username: string, stage: string) =>
  `temp/csr/${username}-base64-encoded-${stage}.csr`;
export const getCsrOutputFileForUsername = (username: string, stage: string) =>
  `temp/kubernetes/${username}-csr-${stage}.yaml`;
export const getKubeconfigFileForUsername = (username: string, stage: string) =>
  `temp/kubeconfigs/${username}-${stage}.yaml`;
export const getCaFileForCluster = (clusterName: string) =>
  `temp/ca/${clusterName}.crt`;
export const getProjectOwnersFile = (project: string) =>
  `projects/${project}/info.yaml`;
export const getKubernetesProjectYamlFile = (project: string, stage: string) =>
  `kubernetes/projects/${project}_${stage}.yaml`;
export const getMigrationYamlFile = (stage: string) =>
  `temp/migrations/${stage}.yaml`;
export const getUsernameFromKubeconfigFile = (
  filename: string,
  stage: string
) => {
  const onlyFile = filename.split("/")[2];
  const suffix = `-${stage.toLowerCase()}.yaml`;
  return onlyFile.replace(suffix, "");
};
export const getKubeconfigsGlob = (stage: string) =>
  `temp/kubeconfigs/*-${stage.toLowerCase()}.yaml`;

export const FILENAME_ALL_OWNERS = "users/all_owners";
export const FILENAME_CLUSTER_INFO = "cluster-info.json";
export const CERTIFICATE_VALID_DAYS = 365;
export const MIGRATIONS_GLOB = "kubernetes/migrations/*.js";
