const getCertFileForUsername = (username, stage) =>
  `${username}-k8s-${stage}-access.crt`;
const getCsrFileForUsername = (username, stage) =>
  `${username}-k8s-${stage}.csr`;
const getKeyFileForUsername = (username, stage) =>
  `${username}-k8s-${stage}.key`;
const getEncodedCsrFileForUsername = (username, stage) =>
  `${username}-base64-encoded-${stage}.csr`;
const getCsrOutputFileForUsername = (username, stage) =>
  `${username}-csr-${stage}.yaml`;
const getKubeconfigFileForUsername = (username, stage) =>
  `${username}-kubeconfig-${stage}.yaml`;
const getCaFileForCluster = (clusterName) => `ca.${clusterName}.crt`;

module.exports = {
  FILENAME_ALL_OWNERS: "users/all_owners",
  FILENAME_CLUSTER_INFO: "cluster-info.json",
  CERTIFICATE_VALID_DAYS: 365,
  getCertFileForUsername,
  getCsrFileForUsername,
  getEncodedCsrFileForUsername,
  getKeyFileForUsername,
  getCsrOutputFileForUsername,
  getKubeconfigFileForUsername,
  getCaFileForCluster,
};
