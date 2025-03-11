import { IMemberRequestBody } from "~/Member/types"
import bcrypt from "bcrypt"
import { RESPONSE_CODE } from "~/types"
import { generateToken } from "~/utils/account"
import { addMember, findMemberBy } from "./member.model"
import { Member } from "~/db/entities/Member"
import FeatureError from "~/utils/FeatureError"
import { parseImageUrl, uploadFiles } from "~/utils/assetHelper"

export const save = async (
  data: IMemberRequestBody,
): Promise<{ newMember: Member; token: string }> => {
  try {
    const { email, password, avatar } = data
    const isEmailExist = await findMemberBy({ email })
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
    const newMember = await addMember({
      ...data,
      avatar: parseImageUrl(avatarImageId),
      password: encryptedPassword,
    })

    const token = generateToken(newMember)
    delete newMember.password

    return { newMember, token }
  } catch (error) {
    throw error
  }
}

export const getMember = async (memberId: string) => {
  try {
    const member = await findMemberBy({ id: memberId })
    if (!member) {
      throw new FeatureError(
        403,
        RESPONSE_CODE.TARGET_NOT_EXISTS,
        "Member not found.",
      )
    }
    return member
  } catch (error) {
    throw error
  }
}
