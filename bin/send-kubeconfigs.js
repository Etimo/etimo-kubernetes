const { program } = require("commander");
const consts = require("../lib/consts");
const fs = require("fs");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const { getTemplate } = require("../lib/templates");
const glob = require("glob");
const { assertFile } = require("../lib/file");
const {
  getKubeconfigFileForUsername,
  getKubeconfigsGlob,
  getUsernameFromKubeconfigFile,
} = require("../lib/consts");
const { readClusterInfo } = require("../lib/cluster-info");
const { getRecipientFromGithubUsername } = require("../lib/email");
const { getUsernameFromGithubUsername } = require("../lib/users");

// Cmd
const options = program
  .option("--dry-run")
  .requiredOption("--mail-username <mail_username>")
  .requiredOption("--mail-password <mail_password>")
  .parse()
  .opts();
const dryRun = options.dryRun || process.env["DRY_RUN"] === "1";
const mailUsername = options.mailUsername;
const mailPassword = options.mailPassword;

// Validate
assertFile(consts.FILENAME_CLUSTER_INFO, true);

const clusterInfo = readClusterInfo();
const attachmentsPerUser = clusterInfo.map((cluster) => {
  const stage = cluster.stage;
  const kubeconfigs = glob.sync(getKubeconfigsGlob(stage));
  console.log(getKubeconfigsGlob(stage), kubeconfigs);
  return kubeconfigs.reduce((total, filename) => {
    const username = getUsernameFromKubeconfigFile(filename, stage);
    total[username] = filename;
    return total;
  }, {});
});
console.log("Found the following kubeconfigs:", attachmentsPerUser);
const totalAttachments = attachmentsPerUser.reduce((total, item) => {
  Object.keys(item).forEach((username) => {
    if (!(username in total)) {
      total[username] = [];
    }
    total[username] = total[username].concat(item[username]);
  });
  return total;
}, {});

Object.keys(totalAttachments).forEach((username) => {
  const attachments = totalAttachments[username].map((path) => ({ path }));
  console.log(`Rendering email for ${username}...`);
  const context = {
    username,
    attachments,
  };
  const subject = getTemplate(handlebars, "email", "subject.hbs")(context);
  const html = getTemplate(handlebars, "email", "body.hbs")(context);
  const to = getUsernameFromGithubUsername(username) + "@etimo.se";

  const message = {
    from: "daniel.winther@etimo.se",
    to,
    subject,
    html,
    attachments,
  };

  console.log("  Sending email...");
  if (!dryRun) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: mailUsername,
        pass: mailPassword,
      },
    });
    transporter.sendMail(message).then((res) => {
      console.log("    -> Email sent!");
    });
  } else {
    console.log("    -> Skipping email sending because of dry run");
  }
});
