import { Mentor } from "~/db/entities/Mentor"
import { findMemberBy, updateMemberAvatar } from "~/Member/member.model"
import { findMentorBy, updateMentorAvatar } from "~/Mentor/mentor.model"
import { IAccount, RESPONSE_CODE } from "~/types"
import FeatureError from "~/utils/FeatureError"
import bcrypt from "bcrypt"
import { generateToken } from "~/utils/account"
import {
  ILoginResult,
  IGetUserInfoResult,
  IGetUserInfo,
  USER_IDENTITY,
  IUpdateAvatar,
} from "./types"
import { parseImageUrl, uploadFiles } from "~/utils/assetHelper"

export const login = async ({
  email,
  password,
}: IAccount): Promise<ILoginResult> => {
  try {
    const findMentor = findMentorBy({ email })
    const findMember = findMemberBy({ email })
    const [mentor, member] = await Promise.all([findMentor, findMember])

    const user = mentor || member
    if (!user) {
      throw new FeatureError(
        401,
        RESPONSE_CODE.USER_DATA_ERROR,
        "User's email or password is not correct",
      )
    }

    const isPasswordCorrect = await bcrypt.compare(password!, user.password!)
    if (!isPasswordCorrect) {
      throw new FeatureError(
        401,
        RESPONSE_CODE.USER_DATA_ERROR,
        "User's email or password is not correct",
      )
    }
    delete user.password
    const token = generateToken(user)
    const identity =
      user instanceof Mentor ? USER_IDENTITY.MENTOR : USER_IDENTITY.MEMBER
    return {
      identity,
      user,
      token,
    }
  } catch (error) {
    throw error
  }
}

export const getUserInfo = async ({
  userId,
}: IGetUserInfo): Promise<IGetUserInfoResult> => {
  try {
    const findMentor = findMentorBy({ id: userId })
    const findMember = findMemberBy({ id: userId })
    const [mentor, member] = await Promise.all([findMentor, findMember])

    const user = mentor || member
    if (!user) {
      throw new FeatureError(
        401,
        RESPONSE_CODE.USER_DATA_ERROR,
        "User is not exist",
      )
    }

    delete user.password
    const identity =
      user instanceof Mentor ? USER_IDENTITY.MENTOR : USER_IDENTITY.MEMBER
    return {
      identity,
      user,
    }
  } catch (error) {
    throw error
  }
}

export const updateAvatar = async ({
  userId,
  identity,
  avatar,
}: IUpdateAvatar) => {
  try {
    const [avatarImageId] = await uploadFiles([avatar[0]])
    const avatarUrl = parseImageUrl(avatarImageId)
    const result =
      identity === USER_IDENTITY.MEMBER
        ? await updateMemberAvatar({ userId, avatar: avatarUrl })
        : await updateMentorAvatar({ userId, avatar: avatarUrl })
    console.log(result, userId, identity)

    return result
  } catch (error) {
    throw error
  }
}
