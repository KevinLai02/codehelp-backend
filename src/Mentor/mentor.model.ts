import dataSource from '~/db/dataSource';
import { Mentor } from '~/db/entities/Mentor';
import { MentorAvailableTime } from '~/db/entities/MentorAvailableTime';
import { MentorDisciplines } from '~/db/entities/MentorDisciplines';
import { MentorSkills } from '~/db/entities/MentorSkills';
import { MentorTools } from '~/db/entities/MentorTools';
import testDataSource from '~/db/testDataSource';
import type { IUpdateAvatarModel } from '~/User/types';
import type {
  IMentorDisciplines,
  IMentorInfo,
  IMentorModel,
  IMentorSkills,
  IMentorTools,
  IUpdateAvailableTime,
} from './types';

export const addMentor = async (data: IMentorModel) => {
  const {
    userName,
    password,
    email,
    avatar,
    gender,
    country,
    title,
    company,
    phoneNumber,
    introduction,
    level,
    linkedInURL,
    primaryExpertise,
    secondaryExpertise,
    tertiaryExpertise,
    education,
  } = data;

  const newMentor = new Mentor();
  newMentor.userName = userName;
  newMentor.password = password;
  newMentor.email = email;
  newMentor.avatar = avatar;
  newMentor.gender = gender;
  newMentor.country = country;
  newMentor.title = title;
  newMentor.company = company;
  newMentor.phoneNumber = phoneNumber;
  newMentor.introduction = introduction;
  newMentor.level = level;
  newMentor.url = linkedInURL;
  newMentor.primaryExpertise = primaryExpertise;
  newMentor.secondaryExpertise = secondaryExpertise;
  newMentor.tertiaryExpertise = tertiaryExpertise;
  newMentor.education = education;

  return await newMentor.save();
};

export const findMentorBy = async ({
  id,
  email,
  userName,
}: {
  id?: string;
  email?: string;
  userName?: string;
}) => {
  return Mentor.createQueryBuilder('mentor')
    .leftJoinAndSelect('mentor.mentorDisciplines', 'mentorDisciplines')
    .leftJoinAndSelect('mentor.mentorTools', 'mentorTools')
    .leftJoinAndSelect('mentor.mentorSkills', 'mentorSkills')
    .leftJoinAndSelect('mentor.mentorAvailableTimes', 'availableTimes')
    .where('mentor.id = :mentorId', { mentorId: id })
    .orWhere('mentor.email = :mentorEmail', { mentorEmail: email })
    .orWhere('mentor.userName = :userName', { userName })
    .getOne();
};

export const findManyAndCount = async ({
  count,
  skip,
  keyword,
}: {
  count: number;
  skip: number;
  keyword?: string;
}) => {
  return Mentor.createQueryBuilder('mentor')
    .leftJoin('mentor.mentorDisciplines', 'mentorDisciplines')
    .leftJoin('mentor.mentorTools', 'mentorTools')
    .leftJoin('mentor.mentorSkills', 'mentorSkills')
    .where("LOWER(mentor.user_name) LIKE LOWER(COALESCE(:keyword, '%'))", {
      keyword: keyword && `%${keyword}%`,
    })
    .select([
      'mentor.id',
      'mentor.userName',
      'mentor.avatar',
      'mentor.email',
      'mentor.gender',
      'mentor.country',
      'mentor.title',
      'mentor.company',
      'mentor.phoneNumber',
      'mentor.introduction',
      'mentor.level',
      'mentor.url',
      'mentor.primaryExpertise',
      'mentor.secondaryExpertise',
      'mentor.tertiaryExpertise',
      'mentor.created_at',
      'mentor.updated_at',
      'mentor.quickReply',
      'mentor.experience',
      'mentorDisciplines',
      'mentorSkills',
      'mentorTools',
    ])
    .take(count)
    .skip(skip)
    .getManyAndCount();
};

export const updateAvailableTime = (
  availableTimeList: IUpdateAvailableTime[]
) => {
  const currentDataSource =
    process.env.NODE_ENV === 'test' ? testDataSource : dataSource;
  const mentorAvailableTimeRepo =
    currentDataSource.getRepository(MentorAvailableTime);

  return mentorAvailableTimeRepo.upsert(availableTimeList, ['mentorId', 'day']);
};

export const addMentorDisciplines = async (
  mentorDisciplinesList: IMentorDisciplines[]
) => {
  return await MentorDisciplines.createQueryBuilder()
    .insert()
    .into(MentorDisciplines)
    .values(mentorDisciplinesList)
    .execute();
};

export const addMentorSkills = async (mentorSkillsList: IMentorSkills[]) => {
  return await MentorSkills.createQueryBuilder()
    .insert()
    .into(MentorSkills)
    .values(mentorSkillsList)
    .execute();
};

export const addMentorTools = async (mentorToolsList: IMentorTools[]) => {
  return await MentorTools.createQueryBuilder()
    .insert()
    .into(MentorTools)
    .values(mentorToolsList)
    .execute();
};

export const updateMentor = ({
  userId,
  data: { linkedInURL, ...data },
}: {
  userId: string;
  data: IMentorInfo;
}) => {
  return Mentor.update({ id: userId }, { ...data, url: linkedInURL });
};

export const removeMentorDisciplines = ({ userId }: { userId: string }) => {
  return MentorDisciplines.createQueryBuilder('disciplines')
    .delete()
    .where('mentor_id = :userId', { userId })
    .execute();
};

export const removeMentorSkills = ({ userId }: { userId: string }) => {
  return MentorSkills.createQueryBuilder('skills')
    .delete()
    .where('mentor_id = :userId', { userId })
    .execute();
};

export const removeMentorTools = ({ userId }: { userId: string }) => {
  return MentorTools.createQueryBuilder('tools')
    .delete()
    .where('mentor_id = :userId', { userId })
    .execute();
};

export const updateMentorAvatar = ({ userId, avatar }: IUpdateAvatarModel) => {
  return Mentor.update({ id: userId }, { avatar });
};
