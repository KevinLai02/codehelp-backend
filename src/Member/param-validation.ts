import Joi from "joi"
import { countryCodes } from "~/utils/country"

export const signUpSchema = Joi.object({
  body: Joi.object().keys({
    userName: Joi.string().required().min(3).max(30),
    password: Joi.string().min(8).max(30).required(),
    email: Joi.string().email().trim().required().max(320),
    avatar: Joi.array().required(),
    gender: Joi.string().valid("m", "f", "n").required(),
    country: Joi.string()
      .valid(...countryCodes)
      .required()
      .uppercase(),
    title: Joi.string().required().max(100),
    company: Joi.string().required().max(100),
    introduction: Joi.string().required().max(500),
    phoneNumber: Joi.string().required().max(20),
    level: Joi.number().required().max(6).min(0),
    fieldOfWork: Joi.array().required().min(1).max(5),
  }),
})

export const getMemberInfoSchema = Joi.object({
  body: Joi.object().keys({
    memberId: Joi.string().uuid().required(),
  }),
})

export const updateMemberInfoSchema = Joi.object({
  body: Joi.object().keys({
    userName: Joi.string().required().min(3).max(30),
    gender: Joi.string().valid("m", "f", "n").required(),
    country: Joi.string()
      .valid(...countryCodes)
      .required()
      .uppercase(),
    title: Joi.string().required().max(100),
    company: Joi.string().required().max(100),
    introduction: Joi.string().required().max(500),
    phoneNumber: Joi.string().required().max(20),
    level: Joi.number().required().max(6).min(0),
    fieldOfWork: Joi.array().required().min(1).max(5),
  }),
})
