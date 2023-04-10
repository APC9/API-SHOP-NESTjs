
import * as Joi from 'joi';

export const joiValidationSchema =  Joi.object({
  PORT: Joi.number().default(3005),
  HOST_API: Joi.string().default('http://localhost:3000/api'),
})