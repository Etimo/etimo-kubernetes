const up = (kubectlWithContext) => kubectlWithContext("create configmap hello");
const down = (kubectlWithContext) =>
  kubectlWithContext("delete configmap hello");

module.exports = {
  up,
  down,
};
