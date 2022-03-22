const glob = require("glob");
const { MIGRATIONS_GLOB } = require("./consts");
const { getDataset } = require("./kubernetes");

const getAppliedMigrations = (kubectlWithContext) =>
  getDataset(kubectlWithContext, "migrations");
const getAllMigrations = () => glob.sync(MIGRATIONS_GLOB);
const getMigrationNumberFromFile = (file) => parseInt(/\/(\d+)_/.exec(file)[1]);

module.exports = {
  getAppliedMigrations,
  getAllMigrations,
  getMigrationNumberFromFile,
};
