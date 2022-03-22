const glob = require("glob");
const { MIGRATIONS_GLOB } = require("./consts");

const getAppliedMigrations = (kubectlWithContext) => {
  const res = kubectlWithContext(
    "--namespace default get configmap migrations -ojson",
    { silent: true }
  );
  if (res.code === 1) {
    // Does not exist
    return null;
  }
  const data = JSON.parse(res.stdout);
  return JSON.parse(data.data?.applied);
};

const getAllMigrations = () => glob.sync(MIGRATIONS_GLOB);
const getMigrationNumberFromFile = (file) => parseInt(/\/(\d+)_/.exec(file)[1]);
const setupMigrations = (kubectlWithContext) => {
  const res = kubectlWithContext(
    "--namespace default get configmap migrations"
  );
};

module.exports = {
  getAppliedMigrations,
  getAllMigrations,
  getMigrationNumberFromFile,
};
