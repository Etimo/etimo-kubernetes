import { program } from "commander";
import shelljs from "shelljs";
import { writeClusterInfo } from "../lib/cluster-info";
import * as schemas from "../lib/schemas";
import { logArgv } from "../lib/utils";

// Cmd
const options = program.option("--dry-run").parse().opts();
logArgv();
const dryRun = options.dryRun || process.env["DRY_RUN"] === "1";

interface TerraformString {
  value: string[];
}

interface TerraformOutput {
  cluster_endpoints: TerraformString;
  cluster_ids: TerraformString;
  cluster_names: TerraformString;
  stages: TerraformString;
}

// Get total list of users in all projects
console.log("Getting output from terraform...");
shelljs.pushd("terraform");
const terraformOutputRes = shelljs.exec("terraform output -json", {
  silent: true,
});
if (terraformOutputRes.code != 0) {
  console.error("Unable to get output from terraform.");
  process.exit(1);
}
shelljs.popd();

console.log("Validation terraform output...");
const terraformOutput = JSON.parse(
  terraformOutputRes.stdout
) as TerraformOutput;
const validationResult =
  schemas.schemaTerraformOutput.validate(terraformOutput);
if (validationResult.error) {
  console.error(validationResult.error);
  process.exit(1);
}
console.log(`  -> data is valid!`);

// Zip all the values together
const terraformData = terraformOutput.cluster_ids.value.map((item, index) => ({
  clusterId: terraformOutput.cluster_ids.value[index],
  clusterName: terraformOutput.cluster_names.value[index],
  clusterEndpoint: terraformOutput.cluster_endpoints.value[index],
  stage: terraformOutput.stages.value[index],
}));
console.log(terraformData);
writeClusterInfo(terraformData);

// Extract ca from cluster
terraformData.forEach((data) => {
  shelljs.exec(
    `ts-node ./bin/doctl-extract-ca.ts --cluster-id ${data.clusterId} --cluster-name ${data.clusterName}`
  );
});
