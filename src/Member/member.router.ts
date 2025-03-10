import express from "express"

import { validation } from "~/middleware/validation"
import { getMemberController, signUp } from "./member.controller"
import { getMemberInfoSchema, signUpSchema } from "./param-validation"
import { uploadFiles } from "~/middleware/file"

const router = express.Router()

router
  .route("/signUp")
  .post(
    uploadFiles.fields([{ name: "avatar", maxCount: 1 }]),
    validation(signUpSchema),
    signUp,
  )

router
  .route("/info/:memberId")
  .get(validation(getMemberInfoSchema), getMemberController)
export default router
