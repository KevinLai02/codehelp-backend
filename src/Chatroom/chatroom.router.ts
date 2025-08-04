import express from 'express';
import auth from '~/middleware/auth';
import { validation } from '~/middleware/validation';
import { paginationSchema } from '~/utils/common-param-validation';
import {
  createChatroom,
  deleteChatroom,
  getChatroom,
  getChatroomList,
} from './chatroom.controller';
import {
  createChatroomSchema,
  deleteChatroomSchema,
  getChatroomInfoSchema,
} from './param-validation';

const router = express.Router();

router
  .route('/create')
  .post(validation(createChatroomSchema), auth, createChatroom);

router
  .route('/info/:chatroomId')
  .get(validation(getChatroomInfoSchema), auth, getChatroom);

router.route('/list').get(validation(paginationSchema), auth, getChatroomList);

router
  .route('/delete/:chatroomId')
  .delete(validation(deleteChatroomSchema), auth, deleteChatroom);
export default router;
