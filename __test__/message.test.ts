import bodyParser from "body-parser"
import express, { Express } from "express"
import request from "supertest"
import { RESPONSE_CODE } from "~/types"
import { SQLite } from "./utils/sqlite.config"
import bcrypt from "bcrypt"
import { MEMBER, MENTOR_ONE, MENTOR_TWO } from "./utils/constant"
import { addMember } from "../src/Member/member.model"
import { Member } from "~/db/entities/Member"
import { generateToken } from "~/utils/account"
import jwt from "jsonwebtoken"
import { add } from "~/Chatroom/chatroom.model"
import messageRouter from "~/Message/message.router"
import { addOneMentor } from "./utils/addOneMentor"

let server: Express
const sqlite = new SQLite()
const CONTENT = "New message for the unit test."
const NOT_EXISTS_ID = "09e7c567-05dd-4cb2-b789-df0344401f88"
const NOT_EXISTS_TOKEN =
  "Bearer " +
  jwt.sign(
    {
      userName: "none",
      email: "none",
      id: NOT_EXISTS_ID,
    },
    String(process.env.TOKEN),
    { expiresIn: "30 day" },
  )
let member: Member
let memberToken: string
let chatroomId: string

let secondMentorToken: string
// For testing when the user is not in chatroom.

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
    server.use("/chatroom", [messageRouter])

    const { newMentorData: mentorOne } = await addOneMentor(MENTOR_ONE)

    const encryptedMemberPassword = await bcrypt.hash(MEMBER.password, 10)
    member = await addMember({
      ...MEMBER,
      password: encryptedMemberPassword,
    })
    memberToken = generateToken(member)

    const { newMentorData: mentorTwo } = await addOneMentor(MENTOR_TWO)
    secondMentorToken = generateToken(mentorTwo)

    const chatroom = await add({
      mentor: mentorOne,
      member: member,
    })
    chatroomId = chatroom.id!
  } catch (error) {
    console.log(error)
    throw error
  }
})

afterAll(() => {
  sqlite.destroy()
})

describe("Message router POST: Create a message", () => {
  it("(o) Should return the message detail when the request is successful.", async () => {
    const res = await request(server)
      .post(`/chatroom/${chatroomId}/newMessage`)
      .send({
        content: CONTENT,
      })
      .set("Authorization", memberToken)

    expect(res.status).toBe(200)
    expect(res.body.message).toMatchObject({
      content: CONTENT,
      chatroom: {
        id: chatroomId,
      },
      userId: member.id,
    })
    expect(res.body.status).toBe("ok")
  })

  it("(x) Should return an error with response code 4002 when the user is not found.", async () => {
    const res = await request(server)
      .post(`/chatroom/${chatroomId}/newMessage`)
      .send({
        content: CONTENT,
      })
      .set("Authorization", NOT_EXISTS_TOKEN)

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })

  it("(x) Should return an error with response code 4004 when the chatroom is not found.", async () => {
    const res = await request(server)
      .post(`/chatroom/${NOT_EXISTS_ID}/newMessage`)
      .send({
        content: CONTENT,
      })
      .set("Authorization", memberToken)

    expect(res.status).toBe(403)
    expect(res.body.code).toBe(RESPONSE_CODE.TARGET_NOT_EXISTS)
  })

  it("(x) Should return an error with response code 4004 when the user is not in this chatroom.", async () => {
    const res = await request(server)
      .post(`/chatroom/${chatroomId}/newMessage`)
      .send({
        content: CONTENT,
      })
      .set("Authorization", secondMentorToken)

    expect(res.status).toBe(403)
    expect(res.body.code).toBe(RESPONSE_CODE.TARGET_NOT_EXISTS)
  })

  it("(x) Should return an error with response code 4001 when the request body is missing the required data.", async () => {
    const res = await request(server)
      .post(`/chatroom/${chatroomId}/newMessage`)
      .set("Authorization", memberToken)

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })

  it("(x) Should return an error with response status 404 when query params 'chatroomId' is missing.", async () => {
    const res = await request(server)
      .post(`/chatroom/newMessage`)
      .send({
        content: CONTENT,
      })
      .set("Authorization", memberToken)

    expect(res.status).toBe(404)
  })
})

/*
 * [POST] Create a message
 *
 * (o) Should return the message detail when the request is successful.
 *
 * (x) Should return an error with response code 4002 when the user is not found.
 *
 * (x) Should return an error with response code 4004 when the chatroom is not found.
 *
 * (x) Should return an error with response code 4004 when the user is not in this chatroom.
 *
 * (x) Should return an error with response code 4001 when the request body is missing the required data.
 *
 * (x) Should return an error with response status 404 when query params 'chatroomId' is missing.
 *
 */

/*
 * [DELETE] Delete the message
 *
 * (o) Should return the status with 'ok' when the request is successful.
 *
 * (x) Should return an error with response code 4004 when the chatroom is not found.
 *
 * (x) Should return an error with response code 4004 when the message owner is not the user.
 *
 * (x) Should return an error with response code 4004 when the user is not in this chatroom.
 *
 * (x) Should return an error with response status 404 when query params 'chatroomId' and 'messageId' is missing.
 *
 */
