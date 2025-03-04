import express from "express"

import auth from "~/middleware/auth"
import { uploadFiles } from "~/middleware/file"
import { validation } from "~/middleware/validation"
import {
  getMentorInfo,
  getMentorList,
  modifyAvailableTime,
  signUp,
} from "./mentor.controller"
import {
  getMentorInfoSchema,
  searchSchema,
  signUpSchema,
  updateAvailableTimeSchema,
} from "./param-validation"

const router = express.Router()

router
  .route("/signUp")
  .post(
    uploadFiles.fields([{ name: "avatar", maxCount: 1 }]),
    validation(signUpSchema),
    signUp,
  )

router.route("/info/:id").get(validation(getMentorInfoSchema), getMentorInfo)

router.route("/list").get(validation(searchSchema), getMentorList)

router
  .route("/updateAvailableTime")
  .put(validation(updateAvailableTimeSchema), auth, modifyAvailableTime)

export default router
