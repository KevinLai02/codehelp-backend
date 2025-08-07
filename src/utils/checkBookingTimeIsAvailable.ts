import { getDay, getHours, getMinutes } from 'date-fns';
import type { MentorAvailableTime } from '~/db/entities/MentorAvailableTime';
import { DAY } from '~/Mentor/types';

const checkBookingTimeIsAvailable = ({
  availableTimeList,
  bookingTime,
}: {
  availableTimeList: MentorAvailableTime[];
  bookingTime: Date;
}) => {
  const availableTimeRange = availableTimeList.find(
    (availableTime) => availableTime.day === DAY[getDay(bookingTime)]
  );

  if (!availableTimeRange) {
    return availableTimeRange;
  }

  const timeCode: number[] =
    typeof availableTimeRange.timeCode === 'string'
      ? JSON.parse(availableTimeRange.timeCode)
      : availableTimeRange.timeCode;

  const bookingTimeInMinutes =
    getHours(bookingTime) * 60 + getMinutes(bookingTime);

  return timeCode.some(
    (time) =>
      time * 60 <= bookingTimeInMinutes && time * 60 + 59 > bookingTimeInMinutes
  );
};

export default checkBookingTimeIsAvailable;
