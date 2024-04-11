import Joi from "joi";

export const schemaProjectName = Joi.string()
  .regex(/^[a-zA-Z][a-z0-9\-\_]+$/)
  .min(1)
  .max(30)
  .required()
  .lowercase()
  .invalid("index"); // index is reserved
export const schemaGithubUsername = Joi.string()
  .regex(/^[A-z0-9\-\_\.]+$/)
  .min(1)
  .max(38)
  .required();
export const schemaBuckets = Joi.array().items({
  name: Joi.string().min(1).max(30).required(),
});

export const schemaEmployees = Joi.array()
  .items({
    githubUsername: schemaGithubUsername,
    username: Joi.string(),
    firstName: Joi.string(),
  })
  .options({ allowUnknown: true });

// Databases
const schemaDatabaseName = Joi.string().regex(/^[a-zA-Z][a-zA-Z0-9\-_]+$/);
const schemaDatabaseType = Joi.string().valid("pg");
const schemaDatabase = Joi.object().keys({
  shared: Joi.boolean().valid(true),
  name: schemaDatabaseName.not(Joi.ref("...name")),
  type: schemaDatabaseType,
});
export const schemaDatabases = Joi.array()
  .items(schemaDatabase)
  .unique((a, b) => a.name === b.name); // Database names must be unique within project

export const schemaProjectStageYaml = Joi.object().keys({
  project: schemaProjectName,
  buckets: schemaBuckets,
  databases: schemaDatabases,
});

// info.yaml
export const schemaInfoYaml = Joi.object().keys({
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
