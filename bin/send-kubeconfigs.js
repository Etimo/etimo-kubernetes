const { program } = require("commander");
const consts = require("../lib/consts");
const glob = require("glob");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const { getTemplate } = require("../lib/templates");

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
        path: filename,
      },
    ],
  };
  const result = await transporter.sendMail(message);
  console.log(result);
});
