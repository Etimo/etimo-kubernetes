const { program } = require("commander");
const shelljs = require("shelljs");
const consts = require("../lib/consts");
const schemas = require("../lib/schemas");
const {
  getKeyFileForUsername,
  getCsrFileForUsername,
  getEncodedCsrFileForUsername,
} = require("../lib/consts");
const { assertValidData } = require("../lib/templates");
const { assertFile } = require("../lib/file");

// Cmd
const options = program.requiredOption("--username <username>").parse().opts();
const username = options.username;
const keyFile = getKeyFileForUsername(username);
const csrFile = getCsrFileForUsername(username);
const encodedCsrFile = getEncodedCsrFileForUsername(username);

// Validation
assertValidData(username, schemas.schemaGithubUsername);
assertFile(keyFile, false);
assertFile(csrFile, false);
assertFile(encodedCsrFile, false);

// Perform
shelljs.exec(
  `openssl req -new -newkey rsa:4096 -nodes -keyout ${keyFile} -out ${csrFile} -subj "/CN=${username}/O=developer" -days ${consts.CERTIFICATE_VALID_DAYS}`
);
shelljs.config.silent = true;
shelljs.cat(csrFile).exec("base64").exec("tr -d '\n'").to(encodedCsrFile);
