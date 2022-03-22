const up = (kubectlWithContext) => kubectlWithContext("create configmap test");
const down = (kubectlWithContext) =>
  kubectlWithContext("delete configmap test");

module.exports = {
  up,
  down,
};
