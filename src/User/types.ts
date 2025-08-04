import type { Member } from '~/db/entities/Member';
import type { Mentor } from '~/db/entities/Mentor';

export interface ILoginResult {
  identity: USER_IDENTITY;
  user: Mentor | Member;
  token: string;
}

export interface IGetUserInfoResult {
  identity: USER_IDENTITY;
  user: Mentor | Member;
}

export interface IGetUserInfo {
  userId: string;
}

export enum USER_IDENTITY {
  MENTOR = 'mentor',
  MEMBER = 'member',
}

export interface IUpdateAvatar {
  userId: string;
  avatar: Express.Multer.File[];
  identity: USER_IDENTITY;
}

export interface IUpdateAvatarModel {
  userId: string;
  avatar: string;
}
