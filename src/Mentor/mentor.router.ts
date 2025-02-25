import express from "express"

import { validation } from "~/middleware/validation"
import {
  getMentorInfoSchema,
  searchSchema,
  signUpSchema,
} from "./param-validation"
import { getMentorInfo, getMentorList, signUp } from "./mentor.controller"
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
  .route("/info/:id")
  .get(validation(getMentorInfoSchema), auth, getMentorInfo)

router.route("/list").get(validation(searchSchema), auth, getMentorList)
export default router
