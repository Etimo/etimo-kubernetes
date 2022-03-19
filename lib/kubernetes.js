const shelljs = require("shelljs");

const getAllNamespaces = () => {
  const res = shelljs.exec(
    "kubectl get namespace --selector provisioner=etimo-kubernetes",
    { silent: true }
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

const getAllUsers = () => {
  const res = shelljs.exec(
    "kubectl get csr --selector provisioner=etimo-kubernetes",
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

module.exports = {
  getAllUsers,
  getAllNamespaces,
};
