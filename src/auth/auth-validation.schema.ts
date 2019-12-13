import * as Joi from '@hapi/joi';

export const AuthSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .alphanum()
    .required()
});
