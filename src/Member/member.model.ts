import { Member } from "~/db/entities/Member"
import { IMemberModel } from "./types"
import { In } from "typeorm"

export const addMember = (data: IMemberModel) => {
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
    fieldOfWork,
  } = data
  const newMember = new Member()
  newMember.userName = userName
  newMember.password = password
  newMember.email = email
  newMember.avatar = avatar
  newMember.gender = gender
  newMember.country = country
  newMember.title = title
  newMember.company = company
  newMember.phoneNumber = phoneNumber
  newMember.introduction = introduction
  newMember.level = level
  newMember.fieldOfWork =
    process.env.NODE_ENV === "test" ? JSON.stringify(fieldOfWork) : fieldOfWork
  return newMember.save()
}

export const findMemberBy = ({
  id,
  email,
  userName,
}: {
  id?: string
  email?: string
  userName?: string
}) => {
  return Member.findOne({
    where: [{ id }, { userName }, { email }],
  })
}

export const findMembersBy = ({ ids }: { ids: string[] }) => {
  return Member.find({
    where: [{ id: In(ids) }],
  })
}
