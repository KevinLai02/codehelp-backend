import bcrypt from "bcrypt"
import bodyParser from "body-parser"
import express, { Express } from "express"
import path from "path"
import request from "supertest"
import { addMentor } from "~/Mentor/mentor.model"
import mentorRouter from "~/Mentor/mentor.router"
import { RESPONSE_CODE } from "~/types"
import { MENTOR_ONE } from "./utils/constant"
import { DataBase } from "./utils/db.config"
import { MENTOR_DISCIPLINES, MENTOR_SKILLS, MENTOR_TOOLS } from "~/Mentor/types"

let server: Express
const DB = new DataBase()
const tokenStartWithBearer = /^Bearer/

const MENTOR_DATA = {
  userName: "testSignUpMentor",
  email: "testSignUpMentor@gmail.com",
  password: "123456789",
  gender: "f",
  country: "TW",
  title: "123",
  company: "123",
  introduction: "123",
  phoneNumber: "0900000000",
  level: 0,
  linkedInURL: "123",
  primaryExpertise: "123",
  secondaryExpertise: "123",
  tertiaryExpertise: "123",
  education: "高雄科技大學-海事資訊科技系",
}

beforeAll(async () => {
  try {
    await DB.setup()
    server = express()
    server.use(bodyParser.json())
    server.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    )
    const encryptedMentorPassword = await bcrypt.hash(MENTOR_ONE.password, 10)
    await addMentor({
      ...MENTOR_ONE,
      password: encryptedMentorPassword,
    })
    server.use("/mentor", [mentorRouter])
  } catch (error) {
    console.log(error)
    throw error
  }
})

afterAll(() => {
  DB.destroy()
})

describe("Mentor router POST: Mentor sign-up", () => {
  it("(o) Should return mentor data and token when sign-up is successfully.", async () => {
    const res = await request(server)
      .post("/mentor/signUp")
      .field(MENTOR_DATA)
      .set({
        "Content-Type": "application/json",
      })
      .field("disciplines[0]", MENTOR_DISCIPLINES.BIOLOGY)
      .field("disciplines[1]", MENTOR_DISCIPLINES.BUSINESS_ADMINISTRATION)
      .field("skills[0]", MENTOR_SKILLS.ADOBE_PHOTOSHOP)
      .field("skills[1]", MENTOR_SKILLS.ANGULAR)
      .field("tools[0]", MENTOR_TOOLS.ADOBE_ILLUSTRATOR)
      .attach("avatar", path.join(__dirname, "/mock/Dog.png"))

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.newMentor).toBeDefined()
    expect(res.body.token).toMatch(tokenStartWithBearer)
    expect(res.body.password).toBeUndefined()
  })

  it("(x) Should return an error with response code 4003 when user email has been created.", async () => {
    const res = await request(server)
      .post("/mentor/signUp")
      .field(MENTOR_DATA)
      .set({
        "Content-Type": "application/json",
      })
      .field("disciplines[0]", MENTOR_DISCIPLINES.BIOLOGY)
      .field("disciplines[1]", MENTOR_DISCIPLINES.BUSINESS_ADMINISTRATION)
      .field("skills[0]", MENTOR_SKILLS.ADOBE_PHOTOSHOP)
      .field("skills[1]", MENTOR_SKILLS.ANGULAR)
      .field("tools[0]", MENTOR_TOOLS.ADOBE_ILLUSTRATOR)
      .attach("avatar", path.join(__dirname, "/mock/Dog.png"))

    expect(res.status).toBe(403)
    expect(res.body.code).toBe(RESPONSE_CODE.DATA_DUPLICATE)
  })

  it("(x) Should return an error with response code 4001 when the request body is missing the required data.", async () => {
    const res = await request(server)
      .post("/mentor/signUp")
      .field(MENTOR_DATA)
      .set({
        "Content-Type": "application/json",
      })
      //Missing data: disciplines, skills
      .field("tools[0]", "first tools")
      .attach("avatar", path.join(__dirname, "/mock/Dog.png"))

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })

  it("(x) Should return an error with response code 4001 when the required data doesn't follow the validation.", async () => {
    const res = await request(server)
      .post("/mentor/signUp")
      .field(MENTOR_DATA)
      .set({
        "Content-Type": "application/json",
      })
      //disciplines, skills and tools data doesn't follow the validation.
      .field("disciplines[0]", "first disciplines")
      .field("skills[0]", "first skill")
      .field("tools[0]", "first tools")
      .attach("avatar", path.join(__dirname, "/mock/Dog.png"))

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })
})

/*
 *  [POST] Mentor sign-up
 *
 *  (o) Should return mentor data and token when sign-up is successfully.
 *
 *  (x) Should return an error with response code 4003 when user email has been created.
 *
 *  (x) Should return an error with response code 4001 when the request body is missing the required data.
 *
 *  (x) Should return an error with response code 4001 when the required data doesn't follow the validation.
 *
 */

describe("Mentor router GET: Mentor List", () => {
  it("(o) Should return mentor list when requested successfully.", async () => {
    const res = await request(server)
      .get("/mentor/list")
      .query({ page: 1, count: 10 })

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.mentorList).toBeDefined()
    expect(res.body.total).toBe(2)
  })

  it("(o) Should return filtered mentor list when the keyword is defined.", async () => {
    const res = await request(server)
      .get("/mentor/list")
      .query({ page: 1, count: 10, keyword: "SignUp" })

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.mentorList.length).toBe(1)
    expect(res.body.total).toBe(1)
  })

  it("(o) Should return empty array when the keyword not found.", async () => {
    const res = await request(server)
      .get("/mentor/list")
      .query({ page: 1, count: 10, keyword: "test for empty array" })

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.mentorList.length).toBe(0)
    expect(res.body.total).toBe(0)
  })

  it("(x) Should return an error with response code 4001 when the pagination params is error.", async () => {
    const res = await request(server)
      .get("/mentor/list")
      // Missing count parameter
      .query({ page: 1 })

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })
})

/*
 *  [GET] Mentor List
 *
 *  (o) Should return mentor list when requested successfully.
 *
 *  (o) Should return filtered mentor list when the keyword is defined.
 *
 *  (o) Should return empty array when the keyword not found.
 *
 *  (x) Should return an error with response code 4001 when the pagination params is error.
 *
 */
