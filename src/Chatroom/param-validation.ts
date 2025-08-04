import Joi from 'joi';

export const createChatroomSchema = Joi.object({
  body: Joi.object().keys({
    mentorId: Joi.string().uuid().required(),
  }),
});

export const getChatroomInfoSchema = Joi.object({
  body: Joi.object().keys({
    chatroomId: Joi.string().uuid().required(),
  }),
});

export const deleteChatroomSchema = Joi.object({
  body: Joi.object().keys({
    chatroomId: Joi.string().uuid().required(),
  }),
});
