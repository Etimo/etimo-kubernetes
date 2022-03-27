import shelljs from "shelljs";
import { getTempFilename } from "./file";
import { renderToFile, getTemplate } from "./templates";
import handlebars from "handlebars";
import { KubeCtlWithContext } from "./interfaces";

export const getAllNamespaces = (kubectlWithContext: KubeCtlWithContext) => {
  const res = kubectlWithContext(
    `get namespace --selector provisioner=etimo-kubernetes`,
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

export const getDataset = <T>(
  kubectlWithContext: KubeCtlWithContext,
  name: string
): Record<string, T> | null => {
  const res = kubectlWithContext(
    `--namespace default get configmap ${name} -o jsonpath='{.data}'`,
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

export const saveDataset = (
  kubectlWithContext: KubeCtlWithContext,
  name: string,
  object: Record<string, unknown>
) => {
  const filename = getTempFilename();
  const data = Object.keys(object).reduce((total, key) => {
    const validKey = getConfigMapKey(key);
    return {
      ...total,
      [validKey]: JSON.stringify(JSON.stringify(object[key])),
    };
  }, {});
  renderToFile(
    getTemplate(handlebars, "kubernetes", "dataset.hbs"),
    {
      name: name,
      data,
    },
    filename
  );
  return kubectlWithContext(`--namespace default apply -f ${filename}`, {
    // silent: true,
  });
};

export const getAllUsers = (
  kubectlWithContext: KubeCtlWithContext
): Set<string> => {
  const data = getDataset(kubectlWithContext, "users");
  if (data === null) {
    return new Set();
  }

  return new Set(Object.keys(data));
};

export const getKubectlForContext = (
  context: string,
  indentOutput = 0
): KubeCtlWithContext => {
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
    if (res.code !== 0) {
      console.error(res.stderr);
    }
    return res;
  };
};

export const getContext = (clusterName: string) => `do-fra1-${clusterName}`;

export const getConfigMapKey = (key: string) => key.replace(/[^a-z0-9]/g, "_");
