import { KubeCtlWithContext } from "../../lib/interfaces";

const files = [
  "https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml",
];

const up = (kubectlWithContext: KubeCtlWithContext) => {
  files.forEach((f) => kubectlWithContext(`apply -f ${f}`));
};

const down = (kubectlWithContext: KubeCtlWithContext) => {
  files.forEach((f) => kubectlWithContext(`delete -f ${f}`));
};
module.exports = {
  up,
  down,
};
