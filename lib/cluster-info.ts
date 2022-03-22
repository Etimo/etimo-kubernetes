import * as fs from "fs";
import { FILENAME_CLUSTER_INFO } from "./consts";

interface Cluster {
  clusterId: string;
  clusterName: string;
  clusterEndpoint: string;
  stage: string;
}

type Clusters = Array<Cluster>;

const writeClusterInfo = (clusterInfo: Clusters) =>
  fs.writeFileSync(FILENAME_CLUSTER_INFO, JSON.stringify(clusterInfo, null, 2));
const readClusterInfo = (): Clusters =>
  JSON.parse(fs.readFileSync(FILENAME_CLUSTER_INFO).toString());

const getClusterInfoForStage = (stage: string) => {
  const info = readClusterInfo();
  return info.filter((c) => c.stage.toLowerCase() === stage.toLowerCase())[0];
};

module.exports = {
  writeClusterInfo,
  readClusterInfo,
  getClusterInfoForStage,
};
