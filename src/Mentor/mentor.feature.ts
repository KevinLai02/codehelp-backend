import bcrypt from "bcrypt"
import { RESPONSE_CODE } from "~/types"
import { IMentorDisciplines, IMentorSkills, IMentorTools } from "./types"
import { generateToken } from "~/utils/account"
import {
  addMentor,
  findManyAndCount,
  findMentorBy,
  addMentorDisciplines,
  addMentorSkills,
  addMentorTools,
} from "./mentor.model"
import { IKeywordPagination, IMentorRequestBody } from "~/Mentor/types"
import { Mentor } from "~/db/entities/Mentor"
import FeatureError from "~/utils/FeatureError"
import { parseImageUrl, uploadFiles } from "~/utils/assetHelper"

export const save = async (
  data: IMentorRequestBody,
): Promise<{ newMentor: Mentor; token: string }> => {
  try {
    const { email, password, avatar, disciplines, tools, skills } = data

    const isEmailExist = await findMentorBy({ email })
    if (isEmailExist) {
      throw new FeatureError(
        403,
        RESPONSE_CODE.DATA_DUPLICATE,
        `Email: ${email} has been created`,
      )
    }

    const result = await uploadFiles([avatar[0]])
    const [avatarImageId] = result

    const encryptedPassword = await bcrypt.hash(password, 10)
    const newMentor = await addMentor({
      ...data,
      avatar: parseImageUrl(avatarImageId),
      password: encryptedPassword,
    })

    const mentorDisciplines: IMentorDisciplines[] = disciplines.map(
      (disciplineName) => ({
        mentorId: newMentor.id!,
        discipline: disciplineName,
      }),
    )

    const mentorSkills: IMentorSkills[] = skills.map((skillName) => ({
      mentorId: newMentor.id!,
      skill: skillName,
    }))

    const mentorTools: IMentorTools[] = tools.map((toolName) => ({
      mentorId: newMentor.id!,
      tool: toolName,
    }))

    await Promise.all([
      addMentorDisciplines(mentorDisciplines),
      addMentorSkills(mentorSkills),
      addMentorTools(mentorTools),
    ])

    const newMentorData = await findMentorBy({ id: newMentor.id })

    const token = generateToken(newMentorData!)
    delete newMentorData!.password

    return { newMentor: newMentorData!, token }
  } catch (error) {
    throw error
  }
}

export const getInfo = async ({ id }: { id: string }): Promise<Mentor> => {
  try {
    const mentor = await findMentorBy({ id })

    if (!mentor) {
      throw new FeatureError(
        404,
        RESPONSE_CODE.USER_DATA_ERROR,
        "User not found.",
      )
    }
    delete mentor.password
    return mentor
  } catch (error) {
    throw error
  }
}

export const getList = async ({
  page,
  count,
  keyword,
}: IKeywordPagination): Promise<{ mentorList: Mentor[]; total: number }> => {
  try {
    const skip = (page - 1) * count
    const [mentorList, total] = await findManyAndCount({ count, skip, keyword })

    return { mentorList, total }
  } catch (error) {
    throw error
  }
}
