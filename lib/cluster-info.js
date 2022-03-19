const fs = require("fs");
const consts = require("./consts");

const writeClusterInfo = (clusterInfo) =>
  fs.writeFileSync(
    consts.FILENAME_CLUSTER_INFO,
    JSON.stringify(clusterInfo, null, 2)
  );
const readClusterInfo = () =>
  JSON.parse(fs.readFileSync(consts.FILENAME_CLUSTER_INFO).toString());

module.exports = {
  writeClusterInfo,
  readClusterInfo,
};
