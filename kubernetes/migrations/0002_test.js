const up = (kubectlWithContext) =>
  kubectlWithContext("create configmap hello2");
const down = (kubectlWithContext) =>
  kubectlWithContext("delete configmap hello2");

module.exports = {
  up,
  down,
};
