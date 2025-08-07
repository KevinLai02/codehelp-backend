import Joi from 'joi';

export const newMessageSchema = Joi.object({
  body: Joi.object().keys({
    chatroomId: Joi.string().uuid().required(),
    content: Joi.string().min(1).max(1000).required(),
  }),
});

export const getMessageRecordsSchema = Joi.object({
  body: Joi.object().keys({
    chatroomId: Joi.string().uuid().required(),
    page: Joi.number().min(1).required(),
    count: Joi.number().min(10).max(10).required(),
  }),
});
