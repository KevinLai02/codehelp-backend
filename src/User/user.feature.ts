import bcrypt from 'bcrypt';
import { Mentor } from '~/db/entities/Mentor';
import { findMemberBy, updateMemberAvatar } from '~/Member/member.model';
import { findMentorBy, updateMentorAvatar } from '~/Mentor/mentor.model';
import { type IAccount, RESPONSE_CODE } from '~/types';
import { generateToken } from '~/utils/account';
import { parseImageUrl, uploadFiles } from '~/utils/assetHelper';
import FeatureError from '~/utils/FeatureError';
import {
  type IGetUserInfo,
  type IGetUserInfoResult,
  type ILoginResult,
  type IUpdateAvatar,
  USER_IDENTITY,
} from './types';

export const login = async ({
  email,
  password,
}: IAccount): Promise<ILoginResult> => {
  const findMentor = findMentorBy({ email });
  const findMember = findMemberBy({ email });
  const [mentor, member] = await Promise.all([findMentor, findMember]);

  const user = mentor || member;
  if (!user) {
    throw new FeatureError(
      401,
      RESPONSE_CODE.USER_DATA_ERROR,
      "User's email or password is not correct"
    );
  }

  const isPasswordCorrect = await bcrypt.compare(password!, user.password!);
  if (!isPasswordCorrect) {
    throw new FeatureError(
      401,
      RESPONSE_CODE.USER_DATA_ERROR,
      "User's email or password is not correct"
    );
  }
  user.password = undefined;
  const token = generateToken(user);
  const identity =
    user instanceof Mentor ? USER_IDENTITY.MENTOR : USER_IDENTITY.MEMBER;
  return {
    identity,
    user,
    token,
  };
};

export const getUserInfo = async ({
  userId,
}: IGetUserInfo): Promise<IGetUserInfoResult> => {
  const findMentor = findMentorBy({ id: userId });
  const findMember = findMemberBy({ id: userId });
  const [mentor, member] = await Promise.all([findMentor, findMember]);

  const user = mentor || member;
  if (!user) {
    throw new FeatureError(
      401,
      RESPONSE_CODE.USER_DATA_ERROR,
      'User is not exist'
    );
  }

  user.password = undefined;
  const identity =
    user instanceof Mentor ? USER_IDENTITY.MENTOR : USER_IDENTITY.MEMBER;
  return {
    identity,
    user,
  };
};

export const updateAvatar = async ({
  userId,
  identity,
  avatar,
}: IUpdateAvatar) => {
  const [avatarImageId] = await uploadFiles([avatar[0]]);
  const avatarUrl = parseImageUrl(avatarImageId);
  const result =
    identity === USER_IDENTITY.MEMBER
      ? await updateMemberAvatar({ userId, avatar: avatarUrl })
      : await updateMentorAvatar({ userId, avatar: avatarUrl });

  return result;
};
