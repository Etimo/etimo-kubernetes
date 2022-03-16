const Joi = require("joi");

const schemaProjectName = Joi.string()
  .regex(/^[a-z][a-z0-9\-\_]+$/)
  .min(1)
  .max(30)
  .required();
const schemaGithubUsername = Joi.string()
  .regex(/^[a-z0-9\-\_]+$/)
  .min(1)
  .max(30)
  .required();
const schemaBuckets = Joi.array().items({
  name: Joi.string().min(1).max(30).required(),
});

const schemaProjectStage = Joi.object().keys({
  codename: Joi.string().alphanum().min(3).max(30).required(),
  buckets: schemaBuckets,
});

const schemaOwners = Joi.object().keys({
  owners: Joi.array().items(schemaGithubUsername),
});

module.exports = {
  schemaProjectName,
  schemaProjectStage,
  schemaBuckets,
  schemaGithubUsername,
  schemaOwners,
};
