import bcrypt from "bcrypt"
import bodyParser from "body-parser"
import express, { Express } from "express"
import request from "supertest"
import { addMember } from "../src/Member/member.model"
import userRouter from "~/User/user.router"
import { RESPONSE_CODE } from "~/types"
import { MEMBER, MENTOR_ONE, TOKEN_START_WITH_BEARER } from "./utils/constant"
import { Member } from "~/db/entities/Member"
import { SQLite } from "./utils/sqlite.config"
import { generateToken } from "~/utils/account"
import { addOneMentor } from "./utils/addOneMentor"
import { generateNotExistsToken } from "./utils/generateNotExistsToken"
import path from "path"

let server: Express
let mentorToken: string
let member: Member
let memberToken: string
const LOGIN_DATA = {
  email: MENTOR_ONE.email,
  password: MENTOR_ONE.password,
}
const NOT_EXISTS_LOGIN_DATA = {
  email: "fake@gmail.com",
  password: "fake1234",
}
const WRONG_PASSWORD = "wrong123"

const sqlite = new SQLite()
const NOT_EXISTS_TOKEN = generateNotExistsToken()
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
    const { newMentorData } = await addOneMentor(MENTOR_ONE)

    mentorToken = generateToken(newMentorData)

    const encryptedMemberPassword = await bcrypt.hash(MEMBER.password, 10)
    member = await addMember({
      ...MEMBER,
      password: encryptedMemberPassword,
    })
    memberToken = generateToken(member)
    console.log(newMentorData.avatar)
    console.log(member.avatar)

    server.use("/user", [userRouter])
  } catch (error) {
    console.log(error)
    throw error
  }
})

afterAll(() => {
  sqlite.destroy()
})

describe("User router POST: User Login", () => {
  it("(o) Should return user info when requested successfully.", async () => {
    const res = await request(server).post("/user/login").send(LOGIN_DATA)

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.user).toBeDefined()
    expect(res.body.token).toMatch(TOKEN_START_WITH_BEARER)
  })

  it("(x) Should return an error with response code 4002 when user password is not correct.", async () => {
    const res = await request(server).post("/user/login").send({
      email: MENTOR_ONE.email,
      password: WRONG_PASSWORD,
    })

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })

  it("(x) Should return an error with response code 4002 when the user is not found.", async () => {
    const res = await request(server)
      .post("/user/login")
      .send(NOT_EXISTS_LOGIN_DATA)

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })
})

/*
 * [POST] User Login
 *
 * (o) Should return user info when requested successfully.
 *
 * (x) Should return an error with response code 4002 when password is not correct.
 *
 * (x) Should return an error with response code 4002 when the user is not found.
 *
 */

describe("User router GET: User Info", () => {
  it("(o) Should return mentor info if identity is mentor when requested successfully.", async () => {
    const res = await request(server)
      .get("/user/info")
      .set("Authorization", mentorToken)

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.user).toBeDefined()
  })

  it("(o) Should return member info if identity is member when requested successfully.", async () => {
    const res = await request(server)
      .get("/user/info")
      .set("Authorization", memberToken)

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.user).toBeDefined()
  })

  it("(x) Should return an error with response code 4002 when the user is not found.", async () => {
    const res = await request(server)
      .get("/user/info")
      .set("Authorization", NOT_EXISTS_TOKEN)

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })
})

/*
 * [GET] User Info
 *
 * (o) Should return mentor info if the identity is mentor when requested successfully.
 *
 * (o) Should return member info if the identity is member when requested successfully.
 *
 * (x) Should return an error with response code 4002 when the user is not found.
 *
 */

describe("User router PUT: Update Avatar", () => {
  it("(o) Should return a successful message when the mentor requested successfully.", async () => {
    const res = await request(server)
      .put("/user/update/avatar")
      .set("Authorization", mentorToken)
      .attach("avatar", path.join(__dirname, "/mock/test.jpg"))

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.message).toBe("Update successfully")
  })

  it("(o) Should return a successful message when the member requested successfully.", async () => {
    const res = await request(server)
      .put("/user/update/avatar")
      .set("Authorization", mentorToken)
      .attach("avatar", path.join(__dirname, "/mock/test.jpg"))

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.message).toBe("Update successfully")
  })

  it("(x) Should return an error with response code 4002 when the user is not found.", async () => {
    const res = await request(server)
      .put("/user/update/avatar")
      .set("Authorization", mentorToken)
      .attach("avatar", path.join(__dirname, "/mock/test.jpg"))

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })

  it("(x) Should return an error with response code 4001 when the avatar is missing.", async () => {
    const res = await request(server)
      .put("/user/update/avatar")
      .set("Authorization", mentorToken)

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })
})

/*
 *  [PUT] Update Avatar
 *
 *  (o) Should return a successful message when the mentor requested successfully.
 *
 *  (o) Should return a successful message when the member requested successfully.
 *
 *  (x) Should return an error with response code 4004 when the user is not found.
 *
 *  (x) Should return an error with response code 4001 when the avatar is missing.
 *
 */
