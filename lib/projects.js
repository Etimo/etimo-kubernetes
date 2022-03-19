const glob = require("glob");
const fs = require("fs");
const consts = require("../lib/consts");

const getAllProjects = () =>
  new Set(glob.sync("projects/*", {}).map((p) => p.split("/")[1]));

const getTotalUsers = () => {
  const existingUsersData = fs
    .readFileSync(consts.FILENAME_ALL_OWNERS)
    .toString();
  return new Set(existingUsersData.split("\n").filter((s) => s.length > 0));
};

module.exports = {
  getTotalUsers,
  getAllProjects,
};
