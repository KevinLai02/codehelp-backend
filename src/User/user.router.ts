import express from "express"

import { validation } from "~/middleware/validation"
import { accountSchema } from "~/utils/common-param-validation"
import {
  loginController,
  getUserInfoController,
  updateAvatarController,
} from "./user.controller"
import auth from "~/middleware/auth"
import { updateAvatarSchema } from "./param-validation"
import { uploadFiles } from "~/middleware/file"

const router = express.Router()

router.route("/login").post(validation(accountSchema), loginController)

router.route("/info").get(auth, getUserInfoController)

router
  .route("/update/avatar")
  .put(
    uploadFiles.fields([{ name: "avatar", maxCount: 1 }]),
    validation(updateAvatarSchema),
    auth,
    updateAvatarController,
  )
export default router
