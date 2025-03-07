import { IApi } from "~/types"
import {
  getBookingRecords,
  getBookingRecord,
  newBooking,
  deleteBookingRecord,
} from "./booking.feature"
import errorHandler from "~/utils/errorHandler"

export const newBookingController: IApi = async (req, res) => {
  try {
    const {
      userId,
      topic,
      question,
      bookingTime,
      duration,
      memberIds,
      picture,
    } = req.body
    const { mentorId } = req.params

    const booking = await newBooking({
      hostId: mentorId,
      memberId: userId,
      topic,
      question,
      bookingTime,
      duration,
      memberIds,
      picture,
    })
    console.log(booking)
    res.status(200).send({
      status: "ok",
      booking,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export const getBookingRecordsController: IApi = async (req, res) => {
  try {
    const { userId } = req.body
    const { page, count } = req.query

    const [bookingRecords, total] = await getBookingRecords({
      userId,
      page: Number(page),
      count: Number(count),
    })

    return res.status(200).send({
      status: "ok",
      total,
      bookingRecords,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export const getBookingRecordController: IApi = async (req, res) => {
  try {
    const { userId } = req.body
    const { bookingId } = req.params

    const bookingRecord = await getBookingRecord({
      userId,
      bookingId,
    })

    return res.status(200).send({
      status: "ok",
      bookingRecord,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export const deleteBookingRecordController: IApi = async (req, res) => {
  try {
    const { userId } = req.body
    const { bookingId } = req.params

    const result = await deleteBookingRecord({
      userId,
      bookingId,
    })

    return res.status(200).send({
      status: "ok",
      message: "Delete successfully",
      affected: result.affected,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}
