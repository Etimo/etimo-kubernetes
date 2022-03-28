const files = [
  "https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml",
];

const up = (kubectlWithContext) => {
  files.forEach((f) => kubectlWithContext(`apply -f ${f}`));
};

const down = (kubectlWithContext) => {
  files.forEach((f) => kubectlWithContext(`delete -f ${f}`));
};
module.exports = {
  up,
  down,
};
