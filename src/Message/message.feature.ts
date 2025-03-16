import {
  findOneBy as findChatroomBy,
  findOneBy,
} from "~/Chatroom/chatroom.model"
import { RESPONSE_CODE } from "~/types"
import FeatureError from "~/utils/FeatureError"
import { addOne, findManyAndCount } from "./message.model"
import { IGetMessageRecords } from "./types"

export const addMessage = async ({
  chatroomId,
  userId,
  content,
}: {
  chatroomId: string
  userId: string
  content: string
}) => {
  try {
    const chatroom = await findChatroomBy({ chatroomId, userId })
    if (!chatroom) {
      throw new FeatureError(
        403,
        RESPONSE_CODE.TARGET_NOT_EXISTS,
        "Chatroom not found or you're not in this chatroom",
      )
    }

    const newMessage = await addOne({ chatroom, userId, content })
    return newMessage
  } catch (error) {
    throw error
  }
}

export const getMessageRecords = async ({
  userId,
  chatroomId,
  page,
  count,
}: IGetMessageRecords) => {
  try {
    const isExists = await findOneBy({ userId, chatroomId })
    if (!isExists) {
      throw new FeatureError(
        403,
        RESPONSE_CODE.NO_PERMISSION,
        "User not in this chatroom or chatroom not exists.",
      )
    }

    const skip = (page - 1) * count
    const messageRecords = await findManyAndCount({
      chatroomId,
      skip,
      count,
    })

    return messageRecords
  } catch (error) {
    throw error
  }
}
