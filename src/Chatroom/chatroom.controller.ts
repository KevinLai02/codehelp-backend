import { getInfo, getList, save, remove } from "./chatroom.feature"
import { IApi } from "~/types"
import errorHandler from "~/utils/errorHandler"

export const createChatroom: IApi = async (req, res) => {
  try {
    const { mentorId, userId } = req.body

    const chatroomId = await save({ memberId: userId, mentorId })

    return res.status(200).send({
      chatroomId,
      status: "ok",
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export const getChatroom: IApi = async (req, res) => {
  try {
    const { userId } = req.body
    const { chatroomId } = req.params

    const chatroom = await getInfo({ chatroomId: chatroomId, userId })

    return res.status(200).send({
      chatroom,
      status: "ok",
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export const getChatroomList: IApi = async (req, res) => {
  try {
    const { userId } = req.body
    const { page, count } = req.query

    const [chatroomList, total] = await getList({
      userId,
      page: Number(page),
      count: Number(count),
    })

    return res.status(200).send({
      chatroomList,
      total,
      status: "ok",
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export const deleteChatroom: IApi = async (req, res) => {
  try {
    const { userId } = req.body
    const { chatroomId } = req.params

    await remove({ chatroomId: chatroomId, userId })

    return res.status(200).send({
      status: "ok",
      message: `Chatroom ${chatroomId} is deleted`,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}
