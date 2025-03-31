import Joi from "joi"

export const updateAvatarSchema = Joi.object({
  body: Joi.object().keys({
    avatar: Joi.array().required(),
  }),
})
