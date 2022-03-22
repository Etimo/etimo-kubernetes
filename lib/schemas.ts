import Joi from "joi";

export const schemaProjectName = Joi.string()
  .regex(/^[a-z][a-z0-9\-\_]+$/)
  .min(1)
  .max(30)
  .required();
export const schemaGithubUsername = Joi.string()
  .regex(/^[a-z0-9\-\_\.]+$/)
  .min(1)
  .max(38)
  .required();
export const schemaBuckets = Joi.array().items({
  name: Joi.string().min(1).max(30).required(),
});

export const schemaProjectStage = Joi.object().keys({
  project: schemaProjectName,
  buckets: schemaBuckets,
});

export const schemaOwners = Joi.object().keys({
  owners: Joi.array().items(schemaGithubUsername),
});

// Terraform schemas
export const schemaTerraformStringArray = Joi.object()
  .keys({
    value: Joi.array().items(Joi.string()),
  })
  .options({ allowUnknown: true });
export const schemaTerraformOutput = Joi.object()
  .keys({
    cluster_endpoints: schemaTerraformStringArray,
    cluster_ids: schemaTerraformStringArray,
    cluster_names: schemaTerraformStringArray,
    stages: schemaTerraformStringArray,
  })
  .options({ allowUnknown: true });

export const assertValidData = (data: unknown, schema: Joi.Schema) => {
  const validationResult = schema.validate(data);
  if (validationResult.error) {
    console.error(validationResult.error);
    process.exit(1);
  }
};
