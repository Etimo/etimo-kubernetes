const shelljs = require("shelljs");

const getAllNamespaces = (kubectlWithContext) => {
  const res = kubectlWithContext(
    `get namespace --selector provisioner=etimo-kubernetes`,
    { silent: false }
  );
  if (res.code !== 0) {
    console.error("Unable to get namespaces in kubernetes.");
    process.exit(1);
  }
  return new Set(
    res.stdout
      .split("\n")
      .filter((s) => s.length > 0)
      .slice(1)
      .map((s) => s.split(" ")[0])
  );
};

const getAllUsers = (kubectlWithContext) => {
  const res = kubectlWithContext(
    `get csr --selector provisioner=etimo-kubernetes`,
    { silent: true }
  );
  if (res.code !== 0) {
    console.error("Unable to get users in kubernetes.");
    process.exit(1);
  }
  return new Set(
    res.stdout
      .split("\n")
      .filter((s) => s.length > 0)
      .slice(1)
      .map((s) => s.split(" ")[0])
  );
};

const getKubectlForContext = (context) => {
  console.log(`Preparing kubectl context ${context}`);
  return (cmd, options) => {
    return shelljs.exec(`kubectl --context ${context} ${cmd}`, options);
  };
};

const getContext = (clusterName) => `do-fra1-${clusterName}`;

module.exports = {
  getAllUsers,
  getAllNamespaces,
  getContext,
  getKubectlForContext,
};
