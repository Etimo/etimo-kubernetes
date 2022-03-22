import { program } from "commander";
import * as consts from "../lib/consts";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import { getTemplate } from "../lib/templates";
import glob from "glob";
import { assertFile } from "../lib/file";
import {
  getKubeconfigsGlob,
  getUsernameFromKubeconfigFile,
} from "../lib/consts";
import { readClusterInfo } from "../lib/cluster-info";
import { getUsernameFromGithubUsername } from "../lib/users";
import { UserAttachments, TotalAttachments } from "../lib/interfaces";

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
  return kubeconfigs.reduce(
    (total, filename) => ({
      ...total,
      [getUsernameFromKubeconfigFile(filename, stage)]: filename,
    }),
    {} as UserAttachments
  );
});
console.log("Found the following kubeconfigs:", attachmentsPerUser);
const totalAttachments = attachmentsPerUser.reduce(
  (total: TotalAttachments, item) => {
    Object.keys(item).forEach((username) => {
      if (!(username in total)) {
        total[username] = [];
      }
      total[username] = total[username].concat(item[username]);
    });
    return total;
  },
  {} as TotalAttachments
);

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
