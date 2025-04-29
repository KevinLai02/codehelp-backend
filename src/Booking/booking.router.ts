import express from "express"
import auth from "~/middleware/auth"

import { uploadFiles } from "~/middleware/file"
import { validation } from "~/middleware/validation"
import { paginationSchema } from "~/utils/common-param-validation"
import {
  deleteBookingRecordController,
  getBookingRecordController,
  getBookingRecordsController,
  newBookingController,
  updateBookingCompleteController,
  updateBookingStatusController,
} from "./booking.controller"
import {
  bookingCompleteSchema,
  newBookingSchema,
  updateStatusSchema,
} from "./param-validation"

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

router
  .route("/update/status/:bookingId")
  .put(validation(updateStatusSchema), auth, updateBookingStatusController)

router
  .route("/update/:bookingId/complete")
  .put(validation(bookingCompleteSchema), auth, updateBookingCompleteController)
export default router
