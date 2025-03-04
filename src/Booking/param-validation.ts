import Joi from "joi"

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
