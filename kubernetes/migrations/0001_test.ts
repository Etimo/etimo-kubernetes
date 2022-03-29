import { KubeCtlWithContext } from "../../lib/interfaces";

const up = (kubectlWithContext: KubeCtlWithContext) =>
  kubectlWithContext("create configmap test");
const down = (kubectlWithContext: KubeCtlWithContext) =>
  kubectlWithContext("delete configmap test");

module.exports = {
  up,
  down,
};
