import { validation } from "~/middleware/validation"
import express from "express"
import { getMessageRecordsSchema, newMessageSchema } from "./param-validation"
import { getMessageRecordsController, newMessage } from "./message.controller"
import auth from "~/middleware/auth"

const router = express.Router()

router
  .route("/:chatroomId/newMessage")
  .post(validation(newMessageSchema), auth, newMessage)

router
  .route("/:chatroomId/message/record")
  .get(validation(getMessageRecordsSchema), auth, getMessageRecordsController)

export default router
