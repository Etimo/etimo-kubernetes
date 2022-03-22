import chalk from "chalk";

export const logArgv = () => {
  console.info(chalk.yellowBright(process.argv.join(" ")));
};
