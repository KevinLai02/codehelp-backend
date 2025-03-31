import { SQLite } from "./utils/sqlite.config"
import express, { Express } from "express"
import bodyParser from "body-parser"
import memberRouter from "~/Member/member.router"
import { addMember, findMemberBy } from "~/Member/member.model"
import {
  MEMBER,
  NOT_EXISTS_ID,
  TOKEN_START_WITH_BEARER,
} from "./utils/constant"
import { Member } from "~/db/entities/Member"
import { generateToken } from "~/utils/account"
import request from "supertest"
import path from "path"
import { RESPONSE_CODE } from "~/types"
import { generateNotExistsToken } from "./utils/generateNotExistsToken"
import { IMemberInfo } from "~/Member/types"

let server: Express
const sqlite = new SQLite()
let member: Member
let memberToken: string
const NOT_EXISTS_TOKEN = generateNotExistsToken()
const MEMBER_DATA = {
  userName: "testSignUpMember",
  email: "testSignUpMember@gmail.com",
  password: "123456789",
  gender: "f",
  country: "TW",
  title: "title",
  company: "company",
  introduction: "introduction",
  phoneNumber: "0900000000",
  level: 0,
  fieldOfWork: ["work1", "work2"],
}

const UPDATE_DATA: IMemberInfo = {
  userName: "updateMember",
  gender: "f",
  country: "TW",
  title: "title",
  company: "company",
  introduction: "update introduction",
  phoneNumber: "0900000000",
  level: 0,
  fieldOfWork: ["work1", "work2"],
}

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

    member = await addMember(MEMBER)
    memberToken = generateToken(member)

    server.use("/member", [memberRouter])
  } catch (error) {
    console.log(error)
    throw error
  }
})

afterAll(() => {
  sqlite.destroy()
})

describe("Member Router Post: Member sign-up", () => {
  it("(o) Should return the mentor data and token when sign-up is successful.", async () => {
    const res = await request(server)
      .post("/member/signUp")
      .field(MEMBER_DATA)
      .attach("avatar", path.join(__dirname, "/mock/Dog.png"))

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.token).toMatch(TOKEN_START_WITH_BEARER)
    expect(res.body.newMember).toBeDefined()
    expect(res.body.newMember.password).toBeUndefined()
  })

  it("(x) Should return an error with response code 4003 when the email has been created.", async () => {
    const res = await request(server)
      .post("/member/signUp")
      .field(MEMBER_DATA)
      .attach("avatar", path.join(__dirname, "/mock/Dog.png"))

    expect(res.status).toBe(403)
    expect(res.body.code).toBe(RESPONSE_CODE.DATA_DUPLICATE)
  })

  it("(x) Should return an error with response code 4001 when the request body is missing the required data.", async () => {
    const res = await request(server)
      .post("/member/signUp")
      //missing avatar
      .field(MEMBER_DATA)

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })
})

/*
 *  [POST] Member sign-up
 *
 *  (o) Should return the mentor data and token when sign-up is successful.
 *
 *  (x) Should return an error with response code 4003 when the email has been created.
 *
 *  (x) Should return an error with response code 4001 when the request body is missing the required data.
 *
 */

describe("Member Router Get: Member info by ID", () => {
  it("(o) Should return the mentor data when requested successfully.", async () => {
    const res = await request(server)
      .get(`/member/info/${member.id}`)
      .set("Authorization", memberToken)

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.member).toBeDefined()
    expect(res.body.member.userName).toBe(member.userName)
  })

  it("(x) Should return an error with response code 4004 when the member not found.", async () => {
    const res = await request(server)
      .get(`/member/info/${NOT_EXISTS_ID}`)
      .set("Authorization", memberToken)

    expect(res.status).toBe(403)
    expect(res.body.code).toBe(RESPONSE_CODE.TARGET_NOT_EXISTS)
  })

  it("(x) Should return an error with response status 404 when the request is missing the member ID.", async () => {
    const res = await request(server)
      .get(`/member/info`)
      .set("Authorization", memberToken)

    expect(res.status).toBe(404)
  })
})

/*
 *  [GET] Member Info By ID
 *
 *  (o) Should return the mentor data when requested successfully.
 *
 *  (x) Should return an error with response code 4004 when the member not found.
 *
 *  (x) Should return an error with response status 404 when the request is missing the member ID.
 *
 */

describe("Member Router Put: Update Member info", () => {
  it("(o) Should return a successful message when requested successfully.", async () => {
    const res = await request(server)
      .put("/member/update/info")
      .set("Authorization", memberToken)
      .send(UPDATE_DATA)

    const updatedMember = await findMemberBy({ id: member.id })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.message).toBe("Update successfully")
    expect(updatedMember?.userName).toBe(UPDATE_DATA.userName)
    expect(updatedMember?.introduction).toBe(UPDATE_DATA.introduction)
  })

  it("(x) Should return an error with response code 4002 when the member is not found.", async () => {
    const res = await request(server)
      .put("/member/update/info")
      .set("Authorization", NOT_EXISTS_TOKEN)
      .send(UPDATE_DATA)

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })

  it("(x) Should return an error with response code 4001 when missing the required data.", async () => {
    const res = await request(server)
      .put("/member/update/info")
      .set("Authorization", memberToken)
      //Missing userName
      .send({
        email: "testSignUpMember@gmail.com",
        password: "123456789",
        gender: "f",
        country: "TW",
        title: "title",
        company: "company",
        introduction: "introduction",
        phoneNumber: "0900000000",
        level: 0,
        fieldOfWork: ["work1", "work2"],
      })

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })
})

/*
 *  [PUT] Update Member Info
 *
 *  (o) Should return a successful message when requested successfully.
 *
 *  (x) Should return an error with response code 4004 when the member is not found.
 *
 *  (x) Should return an error with response code 4001 when missing the required data.
 *
 */
