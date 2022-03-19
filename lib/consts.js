const getCertFileForUsername = (username) => `${username}-k8s-access.crt`;
const getCsrFileForUsername = (username) => `${username}-k8s.csr`;
const getKeyFileForUsername = (username) => `${username}-k8s.key`;
const getEncodedCsrFileForUsername = (username) =>
  `${username}-base64-encoded.csr`;
const getCsrOutputFileForUsername = (username) => `csr-${username}.yaml`;
const getKubeconfigFileForUsername = (username) =>
  `${username}-kubeconfig.yaml`;
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
