import express from 'express';
import auth from '~/middleware/auth';
import { validation } from '~/middleware/validation';
import { getMessageRecordsController, newMessage } from './message.controller';
import { getMessageRecordsSchema, newMessageSchema } from './param-validation';

const router = express.Router();

router
  .route('/:chatroomId/newMessage')
  .post(validation(newMessageSchema), auth, newMessage);

router
  .route('/:chatroomId/message/record')
  .get(validation(getMessageRecordsSchema), auth, getMessageRecordsController);

export default router;
