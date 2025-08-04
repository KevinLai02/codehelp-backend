import Joi from 'joi';

export const accountSchema = Joi.object({
  body: Joi.object().keys({
    email: Joi.string().email().trim().required().max(254),
    password: Joi.string().min(8).max(30).required(),
  }),
});

export const paginationSchema = Joi.object({
  body: Joi.object().keys({
    page: Joi.number().min(1).required(),
    count: Joi.number().min(10).max(10).required(),
  }),
});
