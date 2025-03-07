import Joi from "joi"
import { countryCodes } from "~/utils/country"
import { DAY, MENTOR_DISCIPLINES, MENTOR_SKILLS, MENTOR_TOOLS } from "./types"

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
    level: Joi.number().required().max(3).min(0),
    linkedInURL: Joi.string().required().max(257),
    primaryExpertise: Joi.string().required().max(100),
    secondaryExpertise: Joi.string().required().allow("").max(100),
    tertiaryExpertise: Joi.string().required().allow("").max(100),
    disciplines: Joi.array()
      .items(Joi.string().valid(...Object.values(MENTOR_DISCIPLINES)))
      .required()
      .min(1),
    skills: Joi.array()
      .items(Joi.string().valid(...Object.values(MENTOR_SKILLS)))
      .required()
      .min(1),
    tools: Joi.array()
      .items(Joi.string().valid(...Object.values(MENTOR_TOOLS)))
      .required()
      .min(1),
    education: Joi.string().max(50).required(),
  }),
})

export const getMentorInfoSchema = Joi.object({
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
})

export const searchSchema = Joi.object({
  body: Joi.object().keys({
    keyword: Joi.string().min(1).max(30),
    page: Joi.number().min(1).required(),
    count: Joi.number().min(10).max(10).required(),
  }),
})

const availableTimeItemSchema = Joi.object().keys({
  day: Joi.string()
    .valid(...Object.values(DAY))
    .required(),
  timeCode: Joi.array().max(24).items(Joi.number().min(1).max(24)).required(),
})

export const updateAvailableTimeSchema = Joi.object({
  body: Joi.object().keys({
    availableTimeList: Joi.array()
      .required()
      .max(7)
      .items(availableTimeItemSchema),
  }),
})
