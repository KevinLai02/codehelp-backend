import { findMembersBy } from '~/Member/member.model';
import { findMentorBy } from '~/Mentor/mentor.model';
import { RESPONSE_CODE } from '~/types';
import { parseImageUrl, uploadFiles } from '~/utils/assetHelper';
import checkBookingTimeIsAvailable from '~/utils/checkBookingTimeIsAvailable';
import FeatureError from '~/utils/FeatureError';
import {
  addBooking,
  addBookingMember,
  checkIsBooked,
  deleteOne,
  findBookingBy,
  findBookingRecord,
  findBookingRecords,
  updateStatusByBookingId,
  updateStatusByHostAndBookingId,
} from './booking.model';
import {
  BOOKING_STATUS_LABELS,
  type IBookingComplete,
  type IBookingRecord,
  type IGetBookingRecordsFeature,
  type INewBookingFeature,
  type INewBookingMemberModel,
  type IUpdateBookingStatus,
} from './types';

export const newBooking = async ({
  hostId,
  memberId,
  topic,
  question,
  bookingTime,
  duration,
  memberIds,
  picture,
}: INewBookingFeature) => {
  const checkIsCurrentMemberInMemberIds = memberIds.find(
    (item) => item === memberId
  );
  if (!checkIsCurrentMemberInMemberIds) {
    throw new FeatureError(
      403,
      RESPONSE_CODE.USER_DATA_ERROR,
      'The current member is not in this booking member list'
    );
  }

  const findMentor = findMentorBy({ id: hostId });
  const findMember = findMembersBy({ ids: memberIds });
  const [mentor, members] = await Promise.all([findMentor, findMember]);

  if (!mentor || members.length === 0) {
    throw new FeatureError(
      401,
      RESPONSE_CODE.USER_DATA_ERROR,
      'The mentor or member is not exists'
    );
  }

  if (mentor.mentorAvailableTimes?.length === 0) {
    throw new FeatureError(
      403,
      RESPONSE_CODE.NO_PERMISSION,
      'This mentor does not set available booking time yet.'
    );
  }

  const isAvailable = checkBookingTimeIsAvailable({
    availableTimeList: mentor.mentorAvailableTimes,
    bookingTime,
  });
  if (!isAvailable) {
    throw new FeatureError(
      401,
      RESPONSE_CODE.NO_PERMISSION,
      'The selected time is not in this mentor available time.'
    );
  }
  if (!mentor.id) {
    throw new FeatureError(
      500,
      RESPONSE_CODE.TARGET_NOT_EXISTS,
      'Mentor ID is missing.'
    );
  }
  const isBooked = await checkIsBooked({ hostId: mentor.id, bookingTime });
  if (isBooked) {
    throw new FeatureError(
      403,
      RESPONSE_CODE.DATA_DUPLICATE,
      'The selected time already be booked.'
    );
  }

  let pictureURLs: string[] = [];
  if (picture) {
    const pictureIds = await uploadFiles(picture);
    pictureURLs = pictureIds.map((id) => parseImageUrl(id));
  }

  const createdBooking = await addBooking({
    host: mentor,
    topic,
    question,
    bookingTime,
    duration,
    picture:
      process.env.NODE_ENV === 'test'
        ? JSON.stringify(pictureURLs)
        : pictureURLs,
  });
  if (!createdBooking.id) {
    throw new FeatureError(
      500,
      RESPONSE_CODE.TARGET_NOT_EXISTS,
      'Booking ID was not generated.'
    );
  }
  const memberAndBookingIdList: INewBookingMemberModel[] = memberIds.map(
    (id) => ({
      bookingId: createdBooking.id,
      memberId: id,
    })
  );
  const newBookingMember = await addBookingMember(memberAndBookingIdList);

  return {
    ...createdBooking,
    bookingStatus: BOOKING_STATUS_LABELS[createdBooking.bookingStatus ?? ''],
    members: newBookingMember,
  };
};

export const getBookingRecords = async ({
  page,
  count,
  userId,
}: IGetBookingRecordsFeature) => {
  const skip = (page - 1) * count;
  const result = await findBookingRecords({
    userId,
    count,
    skip,
  });
  return result;
};

export const getBookingRecord = async ({
  userId,
  bookingId,
}: IBookingRecord) => {
  const bookingRecord = await findBookingRecord({
    userId,
    bookingId,
  });

  if (!bookingRecord) {
    throw new FeatureError(
      404,
      RESPONSE_CODE.TARGET_NOT_EXISTS,
      'The booking record is not exists.'
    );
  }

  return bookingRecord;
};

export const deleteBookingRecord = async ({
  userId,
  bookingId,
}: IBookingRecord) => {
  const result = await deleteOne({
    userId,
    bookingId,
  });

  return result;
};

export const updateBookingStatus = async ({
  hostId,
  bookingId,
  bookingStatus,
}: IUpdateBookingStatus) => {
  const result = await updateStatusByHostAndBookingId({
    hostId,
    bookingId,
    bookingStatus,
  });

  return result;
};

export const updateBookingComplete = async ({
  memberId,
  bookingId,
  bookingStatus,
}: IBookingComplete) => {
  const bookingMemberRecord = await findBookingBy({ memberId, bookingId });
  if (!bookingMemberRecord) {
    throw new FeatureError(
      400,
      RESPONSE_CODE.TARGET_NOT_EXISTS,
      'Booking record not found'
    );
  }

  const result = await updateStatusByBookingId({
    bookingId: bookingMemberRecord.bookingId,
    bookingStatus,
  });

  return result;
};
