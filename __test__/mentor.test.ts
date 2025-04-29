import bodyParser from "body-parser"
import express, { Express } from "express"
import path from "path"
import request from "supertest"
import mentorRouter from "~/Mentor/mentor.router"
import {
  IMentorInfo,
  MENTOR_DISCIPLINES,
  MENTOR_SKILLS,
  MENTOR_TOOLS,
} from "~/Mentor/types"
import { RESPONSE_CODE } from "~/types"
import {
  MENTOR_ONE,
  NOT_EXISTS_ID,
  TOKEN_START_WITH_BEARER,
} from "./utils/constant"
import { SQLite } from "./utils/sqlite.config"
import { addOneMentor } from "./utils/addOneMentor"
import { generateToken } from "~/utils/account"
import { findMentorBy } from "~/Mentor/mentor.model"
import { generateNotExistsToken } from "./utils/generateNotExistsToken"

let server: Express
let mentorId: string
let mentorToken: string
const sqlite = new SQLite()

const MENTOR_DATA = {
  userName: "testSignUpMentor",
  email: "testSignUpMentor@gmail.com",
  password: "123456789",
  gender: "f",
  country: "TW",
  title: "title",
  company: "company",
  introduction: "introduction",
  phoneNumber: "0900000000",
  level: 0,
  linkedInURL: "linkedInURL",
  primaryExpertise: "primaryExpertise",
  secondaryExpertise: "secondaryExpertise",
  tertiaryExpertise: "tertiaryExpertise",
  education: "高雄科技大學-海事資訊科技系",
}

const UPDATE_DATA: IMentorInfo = {
  userName: "updateMentor",
  gender: "f",
  country: "TW",
  title: "title",
  company: "company",
  introduction: "update introduction",
  phoneNumber: "0900000000",
  level: 0,
  linkedInURL: "linkedInURL",
  primaryExpertise: "primaryExpertise",
  secondaryExpertise: "secondaryExpertise",
  tertiaryExpertise: "tertiaryExpertise",
  education: "高雄科技大學-海事資訊科技系",
  quickReply: true,
}

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
    const { newMentorData, newMentorId } = await addOneMentor(MENTOR_ONE)

    mentorId = newMentorId
    mentorToken = generateToken(newMentorData)
    server.use("/mentor", [mentorRouter])
  } catch (error) {
    console.log(error)
    throw error
  }
})

afterAll(() => {
  sqlite.destroy()
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
    expect(res.body.token).toMatch(TOKEN_START_WITH_BEARER)
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
      .field("tools[0]", MENTOR_TOOLS.ADOBE_ILLUSTRATOR)
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

describe("Mentor router GET: Mentor Info", () => {
  it("(o) Should return mentor info when requested successfully.", async () => {
    const res = await request(server).get(`/mentor/info/${mentorId}`)

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.mentor).toBeDefined()
  })

  it("(x) Should return an error with response code 4001 when the mentor is not found.", async () => {
    const res = await request(server).get(`/mentor/info/${NOT_EXISTS_ID}`)

    expect(res.status).toBe(404)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })
})

/*
 * [GET] Mentor Info
 *
 * (o) Should return mentor info when requested successfully.
 *
 * (x) Should return an error with response code 4001 when the mentor is not found.
 *
 */

describe("Mentor Router PUT: Update Mentor Info", () => {
  it("(o) Should return a successful message when requested successfully.", async () => {
    const res = await request(server)
      .put("/mentor/update/info")
      .set("Authorization", mentorToken)
      .send(UPDATE_DATA)

    const updatedMentor = await findMentorBy({ id: mentorId })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.message).toBe("Update successfully")
    expect(updatedMentor?.userName).toBe(UPDATE_DATA.userName)
    expect(updatedMentor?.introduction).toBe(UPDATE_DATA.introduction)
  })

  it("(x) Should return an error with response code 4004 when the mentor is not found.", async () => {
    const res = await request(server)
      .put("/mentor/update/info")
      .set("Authorization", NOT_EXISTS_TOKEN)
      .send(UPDATE_DATA)

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })

  it("(x) Should return an error with response code 4001 when missing the required data.", async () => {
    const res = await request(server)
      .put("/mentor/update/info")
      .set("Authorization", mentorToken)
      //Missing userName
      .send({
        gender: "f",
        country: "TW",
        title: "title",
        company: "company",
        introduction: "update introduction",
        phoneNumber: "0900000000",
        level: 0,
        linkedInURL: "linkedInURL",
        primaryExpertise: "primaryExpertise",
        secondaryExpertise: "secondaryExpertise",
        tertiaryExpertise: "tertiaryExpertise",
        education: "高雄科技大學-海事資訊科技系",
      })

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })
})

/*
 *  [PUT] Update Mentor Info
 *
 *  (o) Should return a successful message when requested successfully.
 *
 *  (x) Should return an error with response code 4004 when the mentor is not found.
 *
 *  (x) Should return an error with response code 4001 when missing the required data.
 *
 */

describe("Mentor Router PUT: Update Mentor Disciplines", () => {
  it("(o) Should return a successful message when requested successfully.", async () => {
    const res = await request(server)
      .put("/mentor/update/disciplines")
      .set("Authorization", mentorToken)
      .send({
        disciplines: [MENTOR_DISCIPLINES.DESIGN, MENTOR_DISCIPLINES.SOCIOLOGY],
      })

    const updatedMentor = await findMentorBy({ id: mentorId })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.message).toBe("Update successfully")
    expect(updatedMentor?.mentorDisciplines.length).toBe(2)
  })

  it("(x) Should return an error with response code 4004 when the mentor is not found.", async () => {
    const res = await request(server)
      .put("/mentor/update/disciplines")
      .set("Authorization", NOT_EXISTS_TOKEN)
      .send({
        disciplines: [MENTOR_DISCIPLINES.DESIGN, MENTOR_DISCIPLINES.SOCIOLOGY],
      })

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })

  it("(x) Should return an error with response code 4001 when the discipline array is empty.", async () => {
    const res = await request(server)
      .put("/mentor/update/disciplines")
      .set("Authorization", mentorToken)
      .send({
        disciplines: [],
      })

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })

  it("(x) Should return an error with response code 4001 when the item doesn't follow the validation.", async () => {
    const res = await request(server)
      .put("/mentor/update/disciplines")
      .set("Authorization", mentorToken)
      .send({
        disciplines: ["first discipline"],
      })

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })
})

/*
 *  [PUT] Update Mentor Disciplines
 *
 *  (o) Should return a successful message when requested successfully.
 *
 *  (x) Should return an error with response code 4004 when the mentor is not found.
 *
 *  (x) Should return an error with response code 4001 when the discipline array is empty.
 *
 *  (x) Should return an error with response code 4001 when the item doesn't follow the validation.
 *
 */

describe("Mentor Router PUT: Update Mentor Skills", () => {
  it("(o) Should return a successful message when requested successfully.", async () => {
    const res = await request(server)
      .put("/mentor/update/skills")
      .set("Authorization", mentorToken)
      .send({
        skills: [MENTOR_SKILLS.FIGMA, MENTOR_SKILLS.GIT],
      })

    const updatedMentor = await findMentorBy({ id: mentorId })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.message).toBe("Update successfully")
    expect(updatedMentor?.mentorSkills.length).toBe(2)
  })

  it("(x) Should return an error with response code 4004 when the mentor is not found.", async () => {
    const res = await request(server)
      .put("/mentor/update/skills")
      .set("Authorization", NOT_EXISTS_TOKEN)
      .send({
        skills: [MENTOR_SKILLS.FIGMA, MENTOR_SKILLS.GIT],
      })

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })

  it("(x) Should return an error with response code 4001 when the skill array is empty.", async () => {
    const res = await request(server)
      .put("/mentor/update/skills")
      .set("Authorization", mentorToken)
      .send({
        skills: [],
      })

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })

  it("(x) Should return an error with response code 4001 when the item doesn't follow the validation.", async () => {
    const res = await request(server)
      .put("/mentor/update/skills")
      .set("Authorization", mentorToken)
      .send({
        skills: ["first skill"],
      })

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })
})

/*
 *  [PUT] Update Mentor Skills
 *
 *  (o) Should return a successful message when requested successfully.
 *
 *  (x) Should return an error with response code 4004 when the mentor is not found.
 *
 *  (x) Should return an error with response code 4001 when the skill array is empty.
 *
 *  (x) Should return an error with response code 4001 when the item doesn't follow the validation.
 *
 */

describe("Mentor Router PUT: Update Mentor Tools", () => {
  it("(o) Should return a successful message when requested successfully.", async () => {
    const res = await request(server)
      .put("/mentor/update/tools")
      .set("Authorization", mentorToken)
      .send({
        tools: [MENTOR_TOOLS.AFFINITY_DESIGNER, MENTOR_TOOLS.ADOBE_PHOTOSHOP],
      })

    const updatedMentor = await findMentorBy({ id: mentorId })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.message).toBe("Update successfully")
    expect(updatedMentor?.mentorSkills.length).toBe(2)
  })

  it("(x) Should return an error with response code 4004 when the mentor is not found.", async () => {
    const res = await request(server)
      .put("/mentor/update/tools")
      .set("Authorization", NOT_EXISTS_TOKEN)
      .send({
        tools: [MENTOR_TOOLS.AFFINITY_DESIGNER, MENTOR_TOOLS.ADOBE_PHOTOSHOP],
      })

    expect(res.status).toBe(401)
    expect(res.body.code).toBe(RESPONSE_CODE.USER_DATA_ERROR)
  })

  it("(x) Should return an error with response code 4001 when the tool array is empty.", async () => {
    const res = await request(server)
      .put("/mentor/update/tools")
      .set("Authorization", mentorToken)
      .send({
        tools: [],
      })

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })

  it("(x) Should return an error with response code 4001 when the item doesn't follow the validation.", async () => {
    const res = await request(server)
      .put("/mentor/update/tools")
      .set("Authorization", mentorToken)
      .send({
        tools: ["first tool"],
      })

    expect(res.status).toBe(422)
    expect(res.body.code).toBe(RESPONSE_CODE.VALIDATE_ERROR)
  })
})

/*
 *  [PUT] Update Mentor Tools
 *
 *  (o) Should return a successful message when requested successfully.
 *
 *  (x) Should return an error with response code 4004 when the mentor is not found.
 *
 *  (x) Should return an error with response code 4001 when the tool array is empty.
 *
 *  (x) Should return an error with response code 4001 when the item doesn't follow the validation.
 *
 */
