import { KubeCtlWithContext } from "../../lib/interfaces";
import { assertEnvVariables } from "../../lib/utils";

const up = (kubectlWithContext: KubeCtlWithContext) => {
  assertEnvVariables(["LOGDNA_INGESTION_KEY"]);
  kubectlWithContext(
    `apply -f https://raw.githubusercontent.com/logdna/logdna-agent-v2/3.4.0/k8s/agent-namespace.yaml`
  );
  kubectlWithContext(
    "delete secret logdna-agent-key -n logdna-agent --ignore-not-found=true"
  );
  kubectlWithContext(
    `create secret generic logdna-agent-key -n logdna-agent --from-literal=logdna-agent-key=${process.env.LOGDNA_INGESTION_KEY}`
  );
  kubectlWithContext(
    `apply -f https://raw.githubusercontent.com/logdna/logdna-agent-v2/3.4.0/k8s/agent-resources.yaml`
  );
};

const down = (kubectlWithContext: KubeCtlWithContext) => {
  kubectlWithContext(
    `delete -f https://raw.githubusercontent.com/logdna/logdna-agent-v2/3.4.0/k8s/agent-namespace.yaml`
  );
};
module.exports = {
  up,
  down,
};
