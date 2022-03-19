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
  project: schemaProjectName,
  buckets: schemaBuckets,
});

const schemaOwners = Joi.object().keys({
  owners: Joi.array().items(schemaGithubUsername),
});

// Terraform schemas
const schemaTerraformStringArray = Joi.object()
  .keys({
    value: Joi.array().items(Joi.string()),
  })
  .options({ allowUnknown: true });
const schemaTerraformOutput = Joi.object()
  .keys({
    cluster_endpoints: schemaTerraformStringArray,
    cluster_ids: schemaTerraformStringArray,
    cluster_names: schemaTerraformStringArray,
    stages: schemaTerraformStringArray,
  })
  .options({ allowUnknown: true });

module.exports = {
  schemaProjectName,
  schemaProjectStage,
  schemaBuckets,
  schemaGithubUsername,
  schemaOwners,
  schemaTerraformOutput,
};
