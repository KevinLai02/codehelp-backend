import bcrypt from 'bcrypt';
import type { InsertResult } from 'typeorm';
import type { Mentor } from '~/db/entities/Mentor';
import type { IKeywordPagination, IMentorRequestBody } from '~/Mentor/types';
import { RESPONSE_CODE } from '~/types';
import { generateToken } from '~/utils/account';
import { parseImageUrl, uploadFiles } from '~/utils/assetHelper';
import FeatureError from '~/utils/FeatureError';
import {
  addMentor,
  addMentorDisciplines,
  addMentorSkills,
  addMentorTools,
  findManyAndCount,
  findMentorBy,
  removeMentorDisciplines,
  removeMentorSkills,
  removeMentorTools,
  updateAvailableTime,
  updateMentor,
} from './mentor.model';
import type {
  IAvailableTime,
  IMentorDisciplines,
  IMentorInfo,
  IMentorSkills,
  IMentorTools,
  MENTOR_DISCIPLINES,
  MENTOR_SKILLS,
  MENTOR_TOOLS,
} from './types';
import { addMentorIdToAvailableTimeList } from './utils';

export const save = async (
  data: IMentorRequestBody
): Promise<{ newMentor: Mentor; token: string }> => {
  const { email, password, avatar, disciplines, tools, skills } = data;

  const isEmailExist = await findMentorBy({ email });
  if (isEmailExist) {
    throw new FeatureError(
      403,
      RESPONSE_CODE.DATA_DUPLICATE,
      `Email: ${email} has been created`
    );
  }

  const result = await uploadFiles([avatar[0]]);
  const [avatarImageId] = result;

  const encryptedPassword = await bcrypt.hash(password, 10);
  const newMentor = await addMentor({
    ...data,
    avatar: parseImageUrl(avatarImageId),
    password: encryptedPassword,
  });

  const mentorDisciplines: IMentorDisciplines[] = disciplines.map(
    (disciplineName) => ({
      mentorId: newMentor.id!,
      discipline: disciplineName,
    })
  );

  const mentorSkills: IMentorSkills[] = skills.map((skillName) => ({
    mentorId: newMentor.id!,
    skill: skillName,
  }));

  const mentorTools: IMentorTools[] = tools.map((toolName) => ({
    mentorId: newMentor.id!,
    tool: toolName,
  }));

  await Promise.all([
    addMentorDisciplines(mentorDisciplines),
    addMentorSkills(mentorSkills),
    addMentorTools(mentorTools),
  ]);

  const newMentorData = await findMentorBy({ id: newMentor.id });

  const token = generateToken(newMentorData!);
  newMentorData!.password = undefined;

  return { newMentor: newMentorData!, token };
};

export const getInfo = async ({ id }: { id: string }): Promise<Mentor> => {
  const mentor = await findMentorBy({ id });

  if (!mentor) {
    throw new FeatureError(
      404,
      RESPONSE_CODE.USER_DATA_ERROR,
      'User not found.'
    );
  }
  mentor.password = undefined;
  return mentor;
};

export const getList = async ({
  page,
  count,
  keyword,
}: IKeywordPagination): Promise<{ mentorList: Mentor[]; total: number }> => {
  const skip = (page - 1) * count;
  const [mentorList, total] = await findManyAndCount({ count, skip, keyword });

  return { mentorList, total };
};

export const updateMentorAvailableTime = async ({
  mentorId,
  availableTimeList,
}: {
  mentorId: string;
  availableTimeList: IAvailableTime[];
}): Promise<InsertResult> => {
  const newAvailableTimeList = addMentorIdToAvailableTimeList(
    availableTimeList,
    mentorId
  );

  const result = await updateAvailableTime(newAvailableTimeList);

  return result;
};

export const updateMentorInfo = async ({
  userId,
  data,
}: {
  userId: string;
  data: IMentorInfo;
}) => {
  const result = await updateMentor({ userId, data });

  return result;
};

export const updateDisciplines = async ({
  userId,
  disciplines,
}: {
  userId: string;
  disciplines: MENTOR_DISCIPLINES[];
}) => {
  await removeMentorDisciplines({ userId });
  const mentorDisciplines = disciplines.map((disciplineName) => ({
    mentorId: userId,
    discipline: disciplineName,
  }));
  const result = await addMentorDisciplines(mentorDisciplines);

  return result;
};

export const updateSkills = async ({
  userId,
  skills,
}: {
  userId: string;
  skills: MENTOR_SKILLS[];
}) => {
  await removeMentorSkills({ userId });

  const mentorSkills = skills.map((skillName) => ({
    mentorId: userId,
    skill: skillName,
  }));
  const result = await addMentorSkills(mentorSkills);

  return result;
};

export const updateTools = async ({
  userId,
  tools,
}: {
  userId: string;
  tools: MENTOR_TOOLS[];
}) => {
  await removeMentorTools({ userId });
  const mentorTools = tools.map((toolName) => ({
    mentorId: userId,
    tool: toolName,
  }));
  const result = await addMentorTools(mentorTools);

  return result;
};
