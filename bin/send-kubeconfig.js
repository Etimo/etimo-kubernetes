const { program } = require("commander");
const consts = require("../lib/consts");
const glob = require("glob");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const { getTemplate, assertValidData } = require("../lib/templates");
const { schemaGithubUsername } = require("../lib/schemas");
const { assertFile } = require("../lib/file");
const { getKubeconfigFileForUsername } = require("../lib/consts");
const { readClusterInfo } = require("../lib/cluster-info");

// Cmd
const options = program
  .option("--dry-run")
  .requiredOption("--username <username>")
  .requiredOption("--mail-username <mail_username>")
  .requiredOption("--mail-password <mail_password>")
  .parse()
  .opts();
const dryRun = options.dryRun || process.env["DRY_RUN"] === "1";
const username = options.username;
const mailUsername = options.mailUsername;
const mailPassword = options.mailPassword;

// Validate
assertValidData(username, schemaGithubUsername);
assertFile(consts.FILENAME_CLUSTER_INFO, true);

const clusterInfo = readClusterInfo();
const attachments = clusterInfo.map((cluster) => {
  const stage = cluster.stage;
  const kubeconfigFile = getKubeconfigFileForUsername(username, stage);
});
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: mailUsername,
    pass: mailPassword,
  },
});
const context = {
  username,
};
const message = {
  from: "daniel.winther@etimo.se",
  to: "daniel.winther@etimo.se",
  subject: getTemplate(handlebars, "email", "subject.hbs")(context),
  html: getTemplate(handlebars, "email", "body.hbs")(context),
  attachments: [
    {
      path: kubeconfigFile,
    },
  ],
};
transporter.sendMail(message).then((res) => console.log(res));
