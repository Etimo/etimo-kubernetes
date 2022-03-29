import chalk from "chalk";

export const logArgv = () => {
  console.info(chalk.yellowBright(process.argv.join(" ")));
};

export class MissingEnvironmentVariables extends Error {
  constructor(variables: string[]) {
    super(`Missing environment variables: ${variables}`);
  }
}

export const assertEnvVariables = (variables: string[]) => {
  console.log(
    `Asserting that the following environment variables are available: ${variables}`
  );
  const exists = variables.filter((v) => v in process.env);
  const missing = variables.filter((v) => !(v in process.env));
  console.log(`The following environment variables exist: ${exists}`);
  console.log(`The following environment variables are missing: ${missing}`);
  if (missing.length > 0) {
    throw new MissingEnvironmentVariables(missing);
  }
};
