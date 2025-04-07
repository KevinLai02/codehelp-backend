import bodyParser from "body-parser"
import express, { Express } from "express"
import request from "supertest"
import { RESPONSE_CODE } from "~/types"
import { SQLite } from "./utils/sqlite.config"
import { updateAvailableTime } from "../src/Mentor/mentor.model"
import bcrypt from "bcrypt"
import {
  AVAILABLE_TIME,
  MEMBER,
  MENTOR_ONE,
  MENTOR_TWO,
  NOT_EXISTS_ID,
} from "./utils/constant"
import { addMember } from "../src/Member/member.model"
import { Member } from "~/db/entities/Member"
import { Mentor } from "~/db/entities/Mentor"
import { generateToken } from "~/utils/account"
import { BOOKING_STATUS, BOOKING_STATUS_LABELS } from "~/Booking/types"
import bookingRouter from "~/Booking/booking.router"
import { addMentorIdToAvailableTimeList } from "~/Mentor/utils"
import { BookingMember } from "~/db/entities/BookingMember"
import { format } from "date-fns"
import { addOneMentor } from "./utils/addOneMentor"
import { generateNotExistsToken } from "./utils/generateNotExistsToken"

let server: Express
const sqlite = new SQLite()
let mentor: Mentor
let mentorToken: string
let secondMember: Mentor
let member: Member
let memberToken: string
let bookingId: string
const NOT_AVAILABLE_BOOKING_TIMESTAMP = "2025/03/04 06:00"
const BOOKING_DATA = {
  TOPIC: "booking topic",
  QUESTION: "The booking feature testing.",
  BOOKING_TIME: "2025/03/04 11:00",
  DURATION: 30,
}
const NOT_EXISTS_TOKEN = generateNotExistsToken()
const ERROR_BOOKING_STATUS = "error"
beforeAll(async () => {
  try {
    await sqlite.setup()
    server = express()
    server.use(bodyParser.json())
    server.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    )
    server.use("/booking", [bookingRouter])

    const { newMentorData } = await addOneMentor(MENTOR_ONE)
    mentor = newMentorData
    const MOCK_AVAILABLE_TIME = addMentorIdToAvailableTimeList(
      AVAILABLE_TIME,
      mentor.id,
    )
    await updateAvailableTime(MOCK_AVAILABLE_TIME)
    mentorToken = generateToken(mentor)

    const { newMentorData: secondMentorData } = await addOneMentor(MENTOR_TWO)
    secondMember = secondMentorData

    const encryptedMemberPassword = await bcrypt.hash(MEMBER.password, 10)
    member = await addMember({
      ...MEMBER,
      password: encryptedMemberPassword,
    })
    memberToken = generateToken(member)
  } catch (error) {
    console.log(error)
    throw error
  }
})

afterAll(() => {
  sqlite.destroy()
})

describe("Booking router Post: Create a booking", () => {
  it("(o) Should return the booking detail when requested successfully.", async () => {
    const res = await request(server)
      .post(`/booking/new/${mentor.id}`)
      .field("topic", BOOKING_DATA.TOPIC)
      .field("question", BOOKING_DATA.QUESTION)
      .field("bookingTime", BOOKING_DATA.BOOKING_TIME)
      .field("duration", BOOKING_DATA.DURATION)
      .field("memberIds[0]", member.id)
      .set("Authorization", memberToken)
    bookingId = res.body.booking.id

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.booking.host.id).toBe(mentor.id)
    expect(res.body.booking.host.userName).toBe(mentor.userName)
    expect(
      res.body.booking.members.find(
        (data: BookingMember) => data.memberId === member.id,
      ),
    ).toBeDefined()
    expect(res.body.booking.topic).toBe(BOOKING_DATA.TOPIC)
    expect(res.body.booking.question).toBe(BOOKING_DATA.QUESTION)
    expect(format(res.body.booking.bookingAt, "yyyy/MM/dd hh:mm")).toBe(
      BOOKING_DATA.BOOKING_TIME,
    )
    expect(res.body.booking.duration).toBe(BOOKING_DATA.DURATION)
    expect(res.body.booking.bookingStatus).toBe(
      BOOKING_STATUS_LABELS[BOOKING_STATUS.PENDING],
    )
  })

  it("(x) Should return an error with response code 4003 when the booking time is already booked.", async () => {
    const res = await request(server)
      .post(`/booking/new/${mentor.id}`)
      .field("topic", BOOKING_DATA.TOPIC)
      .field("question", BOOKING_DATA.QUESTION)
      .field("bookingTime", BOOKING_DATA.BOOKING_TIME)
      .field("duration", BOOKING_DATA.DURATION)
      .field("memberIds[0]", member.id)
      .set("Authorization", memberToken)

    expect(res.status).toBe(403)
    expect(res.body.code).toBe(RESPONSE_CODE.DATA_DUPLICATE)
  })

  it("(x) Should return an error with response code 4005 when the booking time is not available.", async () => {
    const res = await request(server)
      .post(`/booking/new/${mentor.id}`)
      .field("topic", BOOKING_DATA.TOPIC)
      .field("question", BOOKING_DATA.QUESTION)
      .field("bookingTime", NOT_AVAILABLE_BOOKING_TIMESTAMP)
      .field("duration", BOOKING_DATA.DURATION)
      .field("memberIds[0]", member.id)
      .set("Authorization", memberToken)

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.NO_PERMISSION)
  })

  it("(x) Should return an error with response code 4005 when the mentor does not set available booking time yet.", async () => {
    const res = await request(server)
      .post(`/booking/new/${secondMember.id}`)
      .field("topic", BOOKING_DATA.TOPIC)
      .field("question", BOOKING_DATA.QUESTION)
      .field("bookingTime", BOOKING_DATA.BOOKING_TIME)
      .field("duration", BOOKING_DATA.DURATION)
      .field("memberIds[0]", member.id)
      .set("Authorization", memberToken)

    expect(res.status).toBe(403)
    expect(res.body.code).toBe(RESPONSE_CODE.NO_PERMISSION)
  })

  it("Should return an error with response code 4002 when the member not in booking member list.", async () => {
    const res = await request(server)
      .post(`/booking/new/${secondMember.id}`)
      .field("topic", BOOKING_DATA.TOPIC)
      .field("question", BOOKING_DATA.QUESTION)
      .field("bookingTime", BOOKING_DATA.BOOKING_TIME)
      .field("duration", BOOKING_DATA.DURATION)
      .field("memberIds[0]", NOT_EXISTS_ID)
      .set("Authorization", memberToken)

    expect(res.status).toBe(403)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })

  it("(x) Should return an error with response code 4002 when member not found.", async () => {
    const res = await request(server)
      .post(`/booking/new/${mentor.id}`)
      .field("topic", BOOKING_DATA.TOPIC)
      .field("question", BOOKING_DATA.QUESTION)
      .field("bookingTime", BOOKING_DATA.BOOKING_TIME)
      .field("duration", BOOKING_DATA.DURATION)
      .field("memberIds[0]", member.id)
      .set("Authorization", NOT_EXISTS_TOKEN)

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })

  it("(x) Should return an error with response code 4002 when mentor not found.", async () => {
    const res = await request(server)
      .post(`/booking/new/${NOT_EXISTS_ID}`)
      .field("topic", BOOKING_DATA.TOPIC)
      .field("question", BOOKING_DATA.QUESTION)
      .field("bookingTime", BOOKING_DATA.BOOKING_TIME)
      .field("duration", BOOKING_DATA.DURATION)
      .field("memberIds[0]", member.id)
      .set("Authorization", memberToken)

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })

  it("(x) Should return an error with response code 4001 when the booking data is missing.", async () => {
    const res = await request(server)
      .post(`/booking/new/${mentor.id}`)
      .field("topic", BOOKING_DATA.TOPIC)
      .field("bookingTime", BOOKING_DATA.BOOKING_TIME)
      .field("duration", BOOKING_DATA.DURATION)
      .field("memberIds[0]", member.id)
      .set("Authorization", memberToken)

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })
})

/*
 *  [POST] Create a Booking
 *
 * (o) Should return the booking detail when requested successfully.
 *
 * (x) Should return an error with response code 4003 when the booking time is already booked.
 *
 * (x) Should return an error with response code 4005 when the booking time is not available.
 *
 * (x) Should return an error with response code 4005 when the mentor does not set available booking time yet.
 *
 * (x) Should return an error with response code 4002 when the member not in booking member list.
 *
 * (x) Should return an error with response code 4002 when member not found.
 *
 * (x) Should return an error with response code 4002 when mentor not found.
 *
 * (x) Should return an error with response code 4001 when the booking data is missing.
 *
 */

describe("Booking router Get: Booking Records", () => {
  it("(o) Should return member's booking records when requested successfully.", async () => {
    const res = await request(server)
      .get("/booking/records")
      .query({ page: 1, count: 10 })
      .set("Authorization", memberToken)

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.total).toBe(1)
    expect(res.body.bookingRecords).toBeDefined()
  })

  it("(o) Should return mentor's booking records when requested successfully.", async () => {
    const res = await request(server)
      .get("/booking/records")
      .query({ page: 1, count: 10 })
      .set("Authorization", mentorToken)

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.total).toBe(1)
    expect(res.body.bookingRecords).toBeDefined()
  })

  it("(x) Should return an error with response code 4002 when the user is not found.", async () => {
    const res = await request(server)
      .get("/booking/records")
      .query({ page: 1, count: 10 })
      .set("Authorization", NOT_EXISTS_TOKEN)

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })

  it("(x) Should return an error with response code 4001 when the pagination data is missing.", async () => {
    const res = await request(server)
      .get("/booking/records")
      .set("Authorization", memberToken)

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })
})

/*
 *  [GET] Booking Records
 *
 *  (o) Should return member's booking records when requested successfully.
 *
 *  (o) Should return mentor's booking records when requested successfully.
 *
 *  (x) Should return an error with response code 4002 when the user is not found.
 *
 *  (x) Should return an error with response code 4001 when the pagination data is missing.
 *
 */

describe("Booking router Get: The Booking Record", () => {
  it("(o) Should return the booking record when requested successfully.", async () => {
    const res = await request(server)
      .get(`/booking/record/${bookingId}`)
      .set("Authorization", memberToken)

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.bookingRecord).toBeDefined()
  })

  it("(x) Should return an error with response code 4002 when the user is not found.", async () => {
    const res = await request(server)
      .get(`/booking/record/${bookingId}`)
      .set("Authorization", NOT_EXISTS_TOKEN)

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })

  it("(x) Should return an error with response code 4004 when the booking is not found.", async () => {
    const res = await request(server)
      .get(`/booking/record/${NOT_EXISTS_ID}`)
      .set("Authorization", memberToken)

    expect(res.status).toBe(404)
    expect(res.body.code).toBe(RESPONSE_CODE.TARGET_NOT_EXISTS)
  })
})

/*
 *  [GET] The Booking Record
 *
 *  (o) Should return the booking record when requested successfully.
 *
 *  (x) Should return an error with response code 4002 when the user is not found.
 *
 *  (x) Should return an error with response code 4004 when the booking is not found.
 *
 */

describe("Booking router Delete: The Booking Record", () => {
  it("(o) Should return successful message when requested successfully.", async () => {
    const res = await request(server)
      .delete(`/booking/delete/${bookingId}`)
      .set("Authorization", memberToken)

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.message).toBe("Delete successfully")
  })

  it("(x) Should return an error with response code 4002 when the user is not found.", async () => {
    const res = await request(server)
      .delete(`/booking/delete/${bookingId}`)
      .set("Authorization", NOT_EXISTS_TOKEN)

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })
})

/*
 *  [DELETE] The Booking Record
 *
 *  (o) Should return successful message when requested successfully.
 *
 *  (x) Should return an error with response code 4002 when the user is not found.
 *
 */

describe("Booking Router PUT: Booking Status", () => {
  it("(o) Should return successful message when the booking status is ACCEPTED requested successfully.", async () => {
    const res = await request(server)
      .put(`/booking/update/status/${bookingId}`)
      .set("Authorization", mentorToken)
      .send({ bookingStatus: BOOKING_STATUS.ACCEPTED })

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.message).toBe(
      `${bookingId} ${BOOKING_STATUS_LABELS[BOOKING_STATUS.ACCEPTED]}`,
    )
  })

  it("(o) Should return successful message when the booking status is REJECTED requested successfully.", async () => {
    const res = await request(server)
      .put(`/booking/update/status/${bookingId}`)
      .set("Authorization", mentorToken)
      .send({ bookingStatus: BOOKING_STATUS.REJECTED })

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.message).toBe(
      `${bookingId} ${BOOKING_STATUS_LABELS[BOOKING_STATUS.REJECTED]}`,
    )
  })

  it("(x) Should return an error with response code 4002 when the mentor is not found.", async () => {
    const res = await request(server)
      .put(`/booking/update/status/${bookingId}`)
      .set("Authorization", NOT_EXISTS_TOKEN)
      .send({ bookingStatus: BOOKING_STATUS.ACCEPTED })

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })

  it("(x) Should return an error with response code 4001 when booking status doesn't follow the validation.", async () => {
    const res = await request(server)
      .put(`/booking/update/status/${bookingId}`)
      .set("Authorization", mentorToken)
      .send({ bookingStatus: ERROR_BOOKING_STATUS })

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })
})

/*
 *  [PUT] Booking Status
 *
 *  (o) Should return successful message when the booking status is ACCEPTED requested successfully.
 *
 *  (o) Should return successful message when the booking status is REJECTED requested successfully.
 *
 *  (x) Should return an error with response code 4002 when the mentor is not found.
 *
 *  (x) Should return an error with response code 4001 when booking status doesn't follow the validation.
 *
 */
