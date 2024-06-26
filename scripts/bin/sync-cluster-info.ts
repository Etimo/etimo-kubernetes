import { program } from "commander";
import { Base64 } from "js-base64";
import shelljs from "shelljs";
import { writeClusterInfo } from "../lib/cluster-info";
import { ICluster, IClusterDatabase, TerraformOutput } from "../lib/interfaces";
import * as schemas from "../lib/schemas";
import { logArgv } from "../lib/utils";

// Cmd
const options = program.option("--dry-run").parse().opts();
logArgv();
const dryRun = options.dryRun || process.env["DRY_RUN"] === "1";

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
const terraformData = terraformOutput.cluster_ids.value.map(
  (item, index) =>
    ({
      clusterId: terraformOutput.cluster_ids.value[index],
      clusterName: terraformOutput.cluster_names.value[index],
      clusterEndpoint: terraformOutput.cluster_endpoints.value[index],
      stage: terraformOutput.stages.value[index].toLowerCase(),
      projects: [],
    } as ICluster)
);

// Look for projects
Object.keys(terraformOutput)
  .filter((key) => key.startsWith("project__"))
  .forEach((key) => {
    const project = terraformOutput[key].value;
    const terraformDataStage = terraformData.find(
      (d) => d.stage === project.stage
    );

    const databases = Object.keys(project.shared_databases).map((key) => {
      const db = project.shared_databases[key];
      const dbu = project.shared_databases_users[key];
      return {
        key,
        name: db.name,
        password: dbu.password,
        user: dbu.name,
        privateHost: db.private_host,
        host: db.host,
        port: db.port,
        ca: Base64.encode(db.ca),
      } as IClusterDatabase;
    });

    terraformDataStage?.projects.push({
      name: project.project,
      databases,
    });
  });
if (!dryRun) {
  writeClusterInfo(terraformData);
  // Extract ca from cluster
  terraformData.forEach((data) => {
    shelljs.exec(
      `ts-node ./scripts/bin/doctl-extract-ca.ts --cluster-id ${data.clusterId} --cluster-name ${data.clusterName}`
    );
  });
}
