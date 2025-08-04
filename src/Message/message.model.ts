import type { Chatroom } from '~/db/entities/Chatroom';
import { Member } from '~/db/entities/Member';
import { Mentor } from '~/db/entities/Mentor';
import { Message } from '~/db/entities/Message';
import type { IGetMessageRecordsModel } from './types';

export const addOne = ({
  chatroom,
  userId,
  content,
}: {
  chatroom: Chatroom;
  userId: string;
  content: string;
}) => {
  const newMessage = new Message();
  newMessage.chatroom = chatroom;
  newMessage.userId = userId;
  newMessage.content = content;
  return newMessage.save();
};

export const findManyAndCount = async ({
  chatroomId,
  skip,
  count,
}: IGetMessageRecordsModel) => {
  const results = await Message.createQueryBuilder('message')
    .leftJoinAndSelect(Mentor, 'mentor', 'mentor.id = message.userId')
    .leftJoinAndSelect(Member, 'member', 'member.id = message.userId')
    .where('message.chatroom = :chatroomId', { chatroomId })
    .skip(skip)
    .take(count)
    .orderBy('message.created_at', 'DESC')
    .getRawMany();

  const messageRecords = results.map((res) => {
    return {
      id: res.message_id,
      user: {
        id: res.mentor_id || res.member_id,
        userName: res.mentor_user_name || res.member_user_name,
        avatar: res.mentor_avatar || res.member_avatar,
      },
      content: res.message_content,
      type: res.message_type,
      createdAt: res.message_created_at,
    };
  });

  return [messageRecords, messageRecords.length];
};
