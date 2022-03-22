import { program } from "commander";
import shelljs from "shelljs";
import * as consts from "../lib/consts";
import * as schemas from "../lib/schemas";
import {
  getKeyFileForUsername,
  getCsrFileForUsername,
  getEncodedCsrFileForUsername,
} from "../lib/consts";
import { assertFile } from "../lib/file";

// Cmd
const options = program
  .requiredOption("--username <username>")
  .requiredOption("--stage <stage>")
  .parse()
  .opts();
const username = options.username;
const stage = options.stage;
const keyFile = getKeyFileForUsername(username, stage);
const csrFile = getCsrFileForUsername(username, stage);
const encodedCsrFile = getEncodedCsrFileForUsername(username, stage);

// Validation
schemas.assertValidData(username, schemas.schemaGithubUsername);
assertFile(keyFile, false);
assertFile(csrFile, false);
assertFile(encodedCsrFile, false);

// Perform
shelljs.exec(
  `openssl req -new -newkey rsa:4096 -nodes -keyout ${keyFile} -out ${csrFile} -subj "/CN=${username}/O=developer" -days ${consts.CERTIFICATE_VALID_DAYS}`
);
shelljs.config.silent = true;
shelljs.cat(csrFile).exec("base64").exec("tr -d '\n'").to(encodedCsrFile);
