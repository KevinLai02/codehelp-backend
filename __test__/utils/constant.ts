import { type IMemberModel, LEVEL_OF_EXPERIENCE } from '~/Member/types';
import {
  type IAvailableTime,
  type IMentorModel,
  MENTOR_DISCIPLINES,
  MENTOR_SKILLS,
  MENTOR_TOOLS,
} from '~/Mentor/types';

const MENTOR_DETAIL = {
  password: '123456789',
  avatar: 'fake avatar url',
  gender: 'f',
  country: 'TW',
  title: '123',
  company: '123',
  introduction: '123',
  phoneNumber: '0900000000',
  level: 0,
  linkedInURL: '123',
  primaryExpertise: '123',
  secondaryExpertise: '123',
  tertiaryExpertise: '123',
  disciplines: [MENTOR_DISCIPLINES.BIOLOGY],
  skills: [MENTOR_SKILLS.ADOBE_PHOTOSHOP],
  tools: [MENTOR_TOOLS.ADOBE_ILLUSTRATOR],
  quickReply: false,
  education: '高雄科技大學-海事資訊科技系',
};

export const MENTOR_ONE: IMentorModel = {
  userName: 'mentor',
  email: 'mentor@gmail.com',
  ...MENTOR_DETAIL,
};

export const MENTOR_TWO: IMentorModel = {
  userName: 'mentor2',
  email: 'mentor2@gmail.com',
  ...MENTOR_DETAIL,
};

const MEMBER_DETAIL = {
  password: '123456789',
  avatar: 'fake avatar url',
  gender: 'f',
  country: 'TW',
  title: '123',
  company: '123',
  phoneNumber: '0900000000',
  introduction: '123',
  level: LEVEL_OF_EXPERIENCE.Senior,
  fieldOfWork: ['123'],
};

export const MEMBER: IMemberModel = {
  userName: 'member',
  email: 'member@gmail.com',
  ...MEMBER_DETAIL,
};

export const AVAILABLE_TIME: IAvailableTime[] = [
  {
    day: 'MON',
    timeCode: [1, 2, 3, 4, 5, 7, 8, 9, 10],
  },
  {
    day: 'TUE',
    timeCode: [9, 10, 11, 12, 13, 14],
  },
  {
    day: 'WED',
    timeCode: [15, 16, 17, 18],
  },
  {
    day: 'THU',
    timeCode: [5, 6, 7, 8, 9, 10],
  },
];
export const NOT_EXISTS_ID = '09e7c567-05dd-4cb2-b789-df0344401f88';

export const TOKEN_START_WITH_BEARER = /^Bearer/;
