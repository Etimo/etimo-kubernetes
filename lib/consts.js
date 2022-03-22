const getCertFileForUsername = (username, stage) =>
  `temp/csr/${username}-k8s-${stage}-access.crt`;
const getCsrFileForUsername = (username, stage) =>
  `temp/csr/${username}-k8s-${stage}.csr`;
const getKeyFileForUsername = (username, stage) =>
  `temp/csr/${username}-k8s-${stage}.key`;
const getEncodedCsrFileForUsername = (username, stage) =>
  `temp/csr/${username}-base64-encoded-${stage}.csr`;
const getCsrOutputFileForUsername = (username, stage) =>
  `temp/kubernetes/${username}-csr-${stage}.yaml`;
const getKubeconfigFileForUsername = (username, stage) =>
  `temp/kubeconfigs/${username}-${stage}.yaml`;
const getCaFileForCluster = (clusterName) => `temp/ca/${clusterName}.crt`;
const getProjectOwnersFile = (project) => `projects/${project}/info.yaml`;
const getKubernetesProjectYamlFile = (project, stage) =>
  `kubernetes/projects/${project}_${stage}.yaml`;
const getMigrationYamlFile = (stage) => `temp/migrations/${stage}.yaml`;

module.exports = {
  FILENAME_ALL_OWNERS: "users/all_owners",
  FILENAME_CLUSTER_INFO: "cluster-info.json",
  CERTIFICATE_VALID_DAYS: 365,
  MIGRATIONS_GLOB: "kubernetes/migrations/*.js",
  getMigrationYamlFile,
  getCertFileForUsername,
  getCsrFileForUsername,
  getEncodedCsrFileForUsername,
  getKeyFileForUsername,
  getCsrOutputFileForUsername,
  getKubeconfigFileForUsername,
  getCaFileForCluster,
  getProjectOwnersFile,
  getKubernetesProjectYamlFile,
};
