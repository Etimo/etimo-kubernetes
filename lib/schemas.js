const Joi = require("joi");

const schemaProjectName = Joi.string().regex(/^[a-z][a-z0-9\-\_]+$/);

const schemaBuckets = Joi.array().items({
  name: Joi.string().min(1).max(30).required(),
});

const schemaProjectStage = Joi.object().keys({
  codename: Joi.string().alphanum().min(3).max(30).required(),
  buckets: schemaBuckets,
});

module.exports = {
  schemaProjectName,
  schemaProjectStage,
  schemaBuckets,
};
