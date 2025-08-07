import { Chatroom } from '~/db/entities/Chatroom';
import type { IChatroomModel } from './types';

export const add = ({ member, mentor }: IChatroomModel) => {
  const newChatroom = new Chatroom();
  newChatroom.member = member;
  newChatroom.mentor = mentor;
  return newChatroom.save();
};

export const checkIsChatroomExists = async ({
  mentorId,
  memberId,
}: {
  mentorId: string;
  memberId: string;
}) => {
  const chatroom = await Chatroom.createQueryBuilder('chatroom')
    .leftJoin('chatroom.member', 'member')
    .leftJoin('chatroom.mentor', 'mentor')
    .where(
      'chatroom.mentor_id = :mentorId AND chatroom.member_id = :memberId',
      {
        mentorId,
        memberId,
      }
    )
    .select(['chatroom.id'])
    .getOne();
  return chatroom;
};

export const findOneBy = async ({
  chatroomId,
  userId,
}: {
  chatroomId: string;
  userId: string;
}) => {
  return Chatroom.createQueryBuilder('chatroom')
    .leftJoin('chatroom.member', 'member')
    .leftJoin('chatroom.mentor', 'mentor')
    .leftJoinAndSelect('chatroom.messages', 'message')
    .where('chatroom.id = :chatroomId AND chatroom.member_id = :userId', {
      chatroomId,
      userId,
    })
    .orWhere('chatroom.id = :chatroomId AND chatroom.mentor_id = :userId', {
      chatroomId,
      userId,
    })
    .select([
      'chatroom.id',
      'chatroom.created_at',
      'member.id',
      'member.userName',
      'member.avatar',
      'mentor.id',
      'mentor.userName',
      'mentor.avatar',
      'message.id',
      'message.userId',
      'message.content',
      'message.created_at',
    ])
    .getOne();
};

export const findManyAndCount = async ({
  userId,
  skip,
  count,
}: {
  userId: string;
  skip: number;
  count: number;
}) => {
  return Chatroom.createQueryBuilder('chatroom')
    .leftJoin('chatroom.member', 'member')
    .leftJoin('chatroom.mentor', 'mentor')
    .where('chatroom.mentor_id = :userId', {
      userId,
    })
    .orWhere('chatroom.member_id = :userId', {
      userId,
    })
    .select([
      'chatroom.id',
      'chatroom.created_at',
      'member.id',
      'member.userName',
      'member.avatar',
      'mentor.id',
      'mentor.userName',
      'mentor.avatar',
    ])
    .skip(skip)
    .take(count)
    .getManyAndCount();
};

export const deleteOne = (chatroomId: string) => {
  return Chatroom.delete({ id: chatroomId });
};
