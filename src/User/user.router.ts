import express from "express"

import { validation } from "~/middleware/validation"
import { accountSchema } from "~/utils/common-param-validation"
import { loginController, getUserInfoController } from "./user.controller"
import auth from "~/middleware/auth"

const router = express.Router()

router.route("/login").post(validation(accountSchema), loginController)

router.route("/info").get(auth, getUserInfoController)

export default router
