import { Mentor } from "~/db/entities/Mentor"
import {
  addMentor,
  addMentorDisciplines,
  addMentorSkills,
  addMentorTools,
  findMentorBy,
} from "~/Mentor/mentor.model"
import { IMentorModel } from "~/Mentor/types"
import bcrypt from "bcrypt"

export const addOneMentor = async (
  mentorData: IMentorModel,
): Promise<{ newMentorData: Mentor; newMentorId: string }> => {
  const encryptedMentorPassword = await bcrypt.hash(mentorData.password, 10)
  const mentor = await addMentor({
    ...mentorData,
    password: encryptedMentorPassword,
  })

  await Promise.all([
    addMentorDisciplines([
      {
        mentorId: mentor.id,
        discipline: mentorData.disciplines[0],
      },
    ]),
    addMentorSkills([
      {
        mentorId: mentor.id,
        skill: mentorData.skills[0],
      },
    ]),
    addMentorTools([
      {
        mentorId: mentor.id,
        tool: mentorData.tools[0],
      },
    ]),
  ])
  const newMentorData = await findMentorBy({ id: mentor.id })

  return { newMentorData: newMentorData!, newMentorId: mentor.id }
}
