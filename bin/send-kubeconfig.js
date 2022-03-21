const { program } = require("commander");
const consts = require("../lib/consts");
const fs = require("fs");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const { getTemplate } = require("../lib/templates");
const { schemaGithubUsername, assertValidData } = require("../lib/schemas");
const { assertFile } = require("../lib/file");
const { getKubeconfigFileForUsername } = require("../lib/consts");
const { readClusterInfo } = require("../lib/cluster-info");
const { getRecipientFromGithubUsername } = require("../lib/email");

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
const attachments = clusterInfo
  .map((cluster) => {
    const stage = cluster.stage;
    const kubeconfigFile = getKubeconfigFileForUsername(username, stage);
    return fs.existsSync(kubeconfigFile) ? kubeconfigFile : null;
  })
  .filter(Boolean)
  .map((path) => ({ path }));
console.log("Found the following kubeconfigs:", attachments);

console.log("Rendering email...");
const context = {
  username,
  attachments,
};
const subject = getTemplate(handlebars, "email", "subject.hbs")(context);
const html = getTemplate(handlebars, "email", "body.hbs")(context);
const to = getRecipientFromGithubUsername(username);

const message = {
  from: "daniel.winther@etimo.se",
  to,
  subject,
  html,
  attachments,
};

console.log("Sending email...");
if (!dryRun) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: mailUsername,
      pass: mailPassword,
    },
  });
  transporter.sendMail(message).then((res) => console.log(res));
  console.log("  -> Email sent!");
} else {
  console.log("  -> Skipping email sending because of dry run");
}
