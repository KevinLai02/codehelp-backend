import Joi from "joi"
import { BOOKING_STATUS } from "./types"

export const newBookingSchema = Joi.object({
  body: Joi.object().keys({
    mentorId: Joi.string().uuid().required(),
    topic: Joi.string().max(30).required(),
    question: Joi.string().required(),
    picture: Joi.array(),
    bookingTime: Joi.date().required(),
    duration: Joi.number().required(),
    memberIds: Joi.array().items(Joi.string().uuid()).required(),
  }),
})

export const updateStatusSchema = Joi.object({
  body: Joi.object().keys({
    bookingId: Joi.string().uuid().required(),
    bookingStatus: Joi.number()
      .valid(BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.REJECTED)
      .required(),
  }),
})

export const bookingCompleteSchema = Joi.object({
  body: Joi.object().keys({
    bookingId: Joi.string().uuid().required(),
    bookingStatus: Joi.number().valid(BOOKING_STATUS.COMPLETED).required(),
  }),
})
