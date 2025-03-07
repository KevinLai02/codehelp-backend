import express from "express"
import auth from "~/middleware/auth"

import { validation } from "~/middleware/validation"
import { newBookingSchema } from "./param-validation"
import {
  deleteBookingRecordController,
  getBookingRecordController,
  getBookingRecordsController,
  newBookingController,
} from "./booking.controller"
import { uploadFiles } from "~/middleware/file"
import { paginationSchema } from "~/utils/common-param-validation"

const router = express.Router()

router
  .route("/new/:mentorId")
  .post(
    uploadFiles.fields([{ name: "picture", maxCount: 10 }]),
    validation(newBookingSchema),
    auth,
    newBookingController,
  )

router
  .route("/records")
  .get(validation(paginationSchema), auth, getBookingRecordsController)

router.route("/record/:bookingId").get(auth, getBookingRecordController)

router.route("/delete/:bookingId").delete(auth, deleteBookingRecordController)
export default router
