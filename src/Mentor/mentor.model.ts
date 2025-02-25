import { Mentor } from "~/db/entities/Mentor"
import { MentorDisciplines } from "~/db/entities/MentorDisciplines"
import { MentorSkills } from "~/db/entities/MentorSkills"
import { MentorTools } from "~/db/entities/MentorTools"
import {
  IMentorModel,
  IMentorDisciplines,
  IMentorTools,
  IMentorSkills,
} from "./types"
import dataSource from "~/db/dataSource"

export const addMentor = async (data: IMentorModel) => {
  const {
    userName,
    password,
    email,
    avatar,
    gender,
    country,
    title,
    company,
    phoneNumber,
    introduction,
    level,
    linkedInURL,
    primaryExpertise,
    secondaryExpertise,
    tertiaryExpertise,
    education,
  } = data

  const newMentor = new Mentor()
  newMentor.userName = userName
  newMentor.password = password
  newMentor.email = email
  newMentor.avatar = avatar
  newMentor.gender = gender
  newMentor.country = country
  newMentor.title = title
  newMentor.company = company
  newMentor.phoneNumber = phoneNumber
  newMentor.introduction = introduction
  newMentor.level = level
  newMentor.url = linkedInURL
  newMentor.primaryExpertise = primaryExpertise
  newMentor.secondaryExpertise = secondaryExpertise
  newMentor.tertiaryExpertise = tertiaryExpertise
  newMentor.education = education

  return await newMentor.save()
}

export const findMentorBy = async ({
  id,
  email,
  userName,
}: {
  id?: string
  email?: string
  userName?: string
}) => {
  return Mentor.createQueryBuilder("mentor")
    .leftJoinAndSelect("mentor.mentorDisciplines", "mentorDisciplines")
    .leftJoinAndSelect("mentor.mentorTools", "mentorTools")
    .leftJoinAndSelect("mentor.mentorSkills", "mentorSkills")
    .where("mentor.id = :mentorId", { mentorId: id })
    .orWhere("mentor.email = :mentorEmail", { mentorEmail: email })
    .orWhere("mentor.userName = :userName", { userName })
    .getOne()
}

export const findManyAndCount = async ({
  count,
  skip,
  keyword,
}: {
  count: number
  skip: number
  keyword?: string
}) => {
  return Mentor.createQueryBuilder("mentor")
    .leftJoin("mentor.mentorDisciplines", "mentorDisciplines")
    .leftJoin("mentor.mentorTools", "mentorTools")
    .leftJoin("mentor.mentorSkills", "mentorSkills")
    .where("mentor.user_name ILIKE COALESCE(:keyword, '%')", {
      keyword: keyword && `%${keyword}%`,
    })
    .select([
      "mentor.id",
      "mentor.userName",
      "mentor.avatar",
      "mentor.email",
      "mentor.gender",
      "mentor.country",
      "mentor.title",
      "mentor.company",
      "mentor.phoneNumber",
      "mentor.introduction",
      "mentor.level",
      "mentor.url",
      "mentor.primaryExpertise",
      "mentor.secondaryExpertise",
      "mentor.tertiaryExpertise",
      "mentor.createdAt",
      "mentor.updatedAt",
      "mentor.quickReply",
      "mentor.experience",
      "mentorDisciplines",
      "mentorSkills",
      "mentorTools",
    ])
    .take(count)
    .skip(skip)
    .getManyAndCount()
}

export const addMentorDisciplines = (
  mentorDisciplinesList: IMentorDisciplines[],
) => {
  const MentorDisciplinesRepo = dataSource.getRepository(MentorDisciplines)
  return MentorDisciplinesRepo.save(mentorDisciplinesList)
}

export const addMentorSkills = (mentorSkillsList: IMentorSkills[]) => {
  const MentorSkillsRepo = dataSource.getRepository(MentorSkills)
  return MentorSkillsRepo.save(mentorSkillsList)
}

export const addMentorTools = (mentorToolsList: IMentorTools[]) => {
  const MentorToolsRepo = dataSource.getRepository(MentorTools)
  return MentorToolsRepo.save(mentorToolsList)
}
