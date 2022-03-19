const { program } = require("commander");
const consts = require("../lib/consts");
const glob = require("glob");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const { getTemplate, assertValidData } = require("../lib/templates");
const { schemaGithubUsername } = require("../lib/schemas");
const { assertFile } = require("../lib/file");
const { getKubeconfigFileForUsername } = require("../lib/consts");

// Cmd
const options = program
  .option("--dry-run")
  .requiredOption("--username <username>")
  .requiredOption("--mail-username <mail_username>")
  .requiredOption("--mail-password <mail_password>")
  .parse()
  .opts();
const dryRun = options.dryRun;
const username = options.username;
const mailUsername = options.mailUsername;
const mailPassword = options.mailPassword;
const kubeconfigFile = getKubeconfigFileForUsername(username);

// Validate
assertValidData(username, schemaGithubUsername);
assertFile(kubeconfigFile, true);

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
