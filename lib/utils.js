const chalk = require("chalk");

const logArgv = () => {
  console.info(chalk.yellowBright(process.argv.join(" ")));
};
module.exports = {
  logArgv,
};
