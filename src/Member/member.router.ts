import express from "express"

import { validation } from "~/middleware/validation"
import {
  getMemberController,
  signUp,
  updateMemberInfoController,
} from "./member.controller"
import {
  getMemberInfoSchema,
  signUpSchema,
  updateMemberInfoSchema,
} from "./param-validation"
import { uploadFiles } from "~/middleware/file"
import auth from "~/middleware/auth"

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

router
  .route("/update/info")
  .put(validation(updateMemberInfoSchema), auth, updateMemberInfoController)
export default router
