const shelljs = require("shelljs");
const { getTempFilename, setFileContent } = require("./file");
const { renderToFile, getTemplate } = require("./templates");
const handlebars = require("handlebars");

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

const getDataset = (kubectlWithContext, dataset) => {
  const res = kubectlWithContext(
    `--namespace default get configmap ${dataset} -o jsonpath='{.data}'`,
    { silent: true }
  );
  if (res.code === 1) {
    // Does not exist
    return null;
  }
  const data = JSON.parse(res.stdout);
  return Object.keys(data).reduce((total, key) => {
    return {
      ...total,
      [key]: JSON.parse(data[key]),
    };
  }, {});
};

const saveDataset = (kubectlWithContext, dataset, object) => {
  const filename = getTempFilename();
  const data = Object.keys(object).reduce((total, key) => {
    const validKey = getValidConfigMapKey(key);
    return {
      ...total,
      [validKey]: JSON.stringify(JSON.stringify(object[key])),
    };
  }, {});
  renderToFile(
    getTemplate(handlebars, "kubernetes", "dataset.hbs"),
    {
      name: dataset,
      data,
    },
    filename
  );
  return kubectlWithContext(`--namespace default apply -f ${filename}`, {
    // silent: true,
  });
};

const getAllUsers = (kubectlWithContext) => {
  const data = getDataset(kubectlWithContext, "users");
  if (data === null) {
    return new Set();
  }

  return new Set(Object.keys(data));
};

const getKubectlForContext = (context, indentOutput = 0) => {
  console.log(`Preparing kubectl context ${context}`);
  return (cmd, options) => {
    const res = shelljs.exec(`kubectl --context ${context} ${cmd}`, {
      silent: true,
    });
    if (!options?.silent) {
      console.log(
        res.stdout
          .split("\n")
          .map((s) => s.padStart(indentOutput, " "))
          .join("\n")
      );
    }
    return res;
  };
};

const getContext = (clusterName) => `do-fra1-${clusterName}`;

const getValidConfigMapKey = (key) => key.replace(/[^a-z0-9]/g, "_");

module.exports = {
  getValidConfigMapKey,
  getAllUsers,
  getAllNamespaces,
  getDataset,
  saveDataset,
  getContext,
  getKubectlForContext,
};
