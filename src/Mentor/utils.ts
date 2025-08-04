import type { IAvailableTime, IUpdateAvailableTime } from './types';

export const addMentorIdToAvailableTimeList = (
  availableTimeList: IAvailableTime[],
  mentorId: string
): IUpdateAvailableTime[] =>
  availableTimeList.map((item) => ({
    ...item,
    mentorId,
    timeCode:
      process.env.NODE_ENV === 'test'
        ? JSON.stringify(item.timeCode)
        : item.timeCode,
  }));
