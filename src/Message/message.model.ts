import { Chatroom } from "~/db/entities/Chatroom"
import { Message } from "~/db/entities/Message"
import { IGetMessageRecordsModel } from "./types"

export const addOne = ({
  chatroom,
  userId,
  content,
}: {
  chatroom: Chatroom
  userId: string
  content: string
}) => {
  const newMessage = new Message()
  newMessage.chatroom = chatroom
  newMessage.userId = userId
  newMessage.content = content
  return newMessage.save()
}

export const findManyAndCount = ({
  chatroomId,
  skip,
  count,
}: IGetMessageRecordsModel) => {
  return Message.createQueryBuilder("message")
    .where("message.chatroom = :chatroomId", { chatroomId })
    .skip(skip)
    .take(count)
    .getManyAndCount()
}
