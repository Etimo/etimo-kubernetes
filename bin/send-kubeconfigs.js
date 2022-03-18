const { program } = require("commander");
const shelljs = require("shelljs");
const fs = require("fs");
const consts = require("../lib/consts");
const glob = require("glob");
const nodemailer = require("nodemailer");

// Cmd
const options = program
  .option("--dry-run")
  .requiredOption("--mail-username <mail_username>")
  .requiredOption("--mail-password <mail_password>")
  .parse()
  .opts();
const dryRun = options.dryRun;
const mailUsername = options.mailUsername;
const mailPassword = options.mailPassword;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: mailUsername,
    pass: mailPassword,
  },
});

glob.sync(`*${consts.KUBECONFIG_SUFFIX}`).forEach(async (filename) => {
  const username = filename.replace(consts.KUBECONFIG_SUFFIX, "");
  const message = {
    from: "daniel.winther@etimo.se",
    to: "daniel.winther@etimo.se",
    subject: "Välkommen till Etimo Kubernetes!",
    html: "<p>Bifogat finner du din personliga configfil för Kubernetes. Du kan läsa mer om hur du använder den <a href='#'>här</a>.</p>",
    attachments: [
      {
        path: filename,
      },
    ],
  };
  const result = await transporter.sendMail(message);
  console.log(result);
});
