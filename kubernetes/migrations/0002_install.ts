import { KubeCtlWithContext } from "../../lib/interfaces";

const files = [
  "https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.2/deploy/static/provider/do/deploy.yaml",
  "https://github.com/jetstack/cert-manager/releases/download/v1.7.1/cert-manager.yaml",
  "https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.17.3/controller.yaml",
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
