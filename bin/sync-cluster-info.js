const { program } = require("commander");
const shelljs = require("shelljs");
const { writeClusterInfo } = require("../lib/cluster-info");
const schemas = require("../lib/schemas");

// Cmd
const options = program.option("--dry-run").parse().opts();
const dryRun = options.dryRun;

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
console.log(terraformOutputRes.stdout);
const terraformOutput = JSON.parse(terraformOutputRes.stdout);
console.log(terraformOutput);
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
    `./bin/doctl-extract-ca.sh ${data.clusterId} ${data.clusterName}`
  );
});
