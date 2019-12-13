import * as Joi from '@hapi/joi';

export const CreateTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .required(),
  description: Joi.string()
    .trim()
    .required()
});

export const FilterTaskSchema = Joi.object({
  status: Joi.string()
    .optional()
    .valid('OPEN', 'IN_PROGRESS', 'DONE'),
  search: Joi.string()
    .trim()
    .optional()
});
