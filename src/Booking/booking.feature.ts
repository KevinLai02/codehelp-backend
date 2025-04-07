import { findMentorBy } from "~/Mentor/mentor.model"
import {
  BOOKING_STATUS_LABELS,
  IBookingRecord,
  IGetBookingRecordsFeature,
  INewBookingFeature,
  INewBookingMemberModel,
  IUpdateBookingStatus,
} from "./types"
import { findMembersBy } from "~/Member/member.model"
import checkBookingTimeIsAvailable from "~/utils/checkBookingTimeIsAvailable"
import FeatureError from "~/utils/FeatureError"
import { RESPONSE_CODE } from "~/types"
import {
  addBooking,
  addBookingMember,
  checkIsBooked,
  deleteOne,
  findBookingRecord,
  findBookingRecords,
  updateStatus,
} from "./booking.model"
import { parseImageUrl, uploadFiles } from "~/utils/assetHelper"

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
  try {
    const checkIsCurrentMemberInMemberIds = memberIds.find(
      (item) => item === memberId,
    )
    if (!checkIsCurrentMemberInMemberIds) {
      throw new FeatureError(
        403,
        RESPONSE_CODE.USER_DATA_ERROR,
        "The current member is not in this booking member list",
      )
    }

    const findMentor = findMentorBy({ id: hostId })
    const findMember = findMembersBy({ ids: memberIds })
    const [mentor, members] = await Promise.all([findMentor, findMember])

    if (!mentor || members.length === 0) {
      throw new FeatureError(
        401,
        RESPONSE_CODE.USER_DATA_ERROR,
        "The mentor or member is not exists",
      )
    }

    if (mentor.mentorAvailableTimes?.length === 0) {
      throw new FeatureError(
        403,
        RESPONSE_CODE.NO_PERMISSION,
        "This mentor does not set available booking time yet.",
      )
    }

    const isAvailable = checkBookingTimeIsAvailable({
      availableTimeList: mentor.mentorAvailableTimes,
      bookingTime,
    })
    if (!isAvailable) {
      throw new FeatureError(
        401,
        RESPONSE_CODE.NO_PERMISSION,
        "The selected time is not in this mentor available time.",
      )
    }
    const isBooked = await checkIsBooked({ hostId: mentor.id!, bookingTime })
    if (isBooked) {
      throw new FeatureError(
        403,
        RESPONSE_CODE.DATA_DUPLICATE,
        "The selected time already be booked.",
      )
    }

    let pictureURLs: string[] = []
    if (picture) {
      const pictureIds = await uploadFiles(picture)
      pictureURLs = pictureIds.map((id) => parseImageUrl(id))
    }

    const newBooking = await addBooking({
      host: mentor,
      topic,
      question,
      bookingTime,
      duration,
      picture:
        process.env.NODE_ENV === "test"
          ? JSON.stringify(pictureURLs)
          : pictureURLs,
    })
    const memberAndBookingIdList: INewBookingMemberModel[] = memberIds.map(
      (memberId) => ({
        bookingId: newBooking.id!,
        memberId: memberId,
      }),
    )
    const newBookingMember = await addBookingMember(memberAndBookingIdList)

    return {
      ...newBooking,
      bookingStatus: BOOKING_STATUS_LABELS[newBooking.bookingStatus!],
      members: newBookingMember,
    }
  } catch (error) {
    throw error
  }
}

export const getBookingRecords = async ({
  page,
  count,
  userId,
}: IGetBookingRecordsFeature) => {
  try {
    const skip = (page - 1) * count
    const result = await findBookingRecords({
      userId,
      count,
      skip,
    })
    return result
  } catch (error) {
    throw error
  }
}

export const getBookingRecord = async ({
  userId,
  bookingId,
}: IBookingRecord) => {
  try {
    const bookingRecord = await findBookingRecord({
      userId,
      bookingId,
    })

    if (!bookingRecord) {
      throw new FeatureError(
        404,
        RESPONSE_CODE.TARGET_NOT_EXISTS,
        "The booking record is not exists.",
      )
    }

    return bookingRecord
  } catch (error) {
    throw error
  }
}

export const deleteBookingRecord = async ({
  userId,
  bookingId,
}: IBookingRecord) => {
  try {
    const result = await deleteOne({
      userId,
      bookingId,
    })

    return result
  } catch (error) {
    throw error
  }
}

export const updateBookingStatus = async ({
  userId,
  bookingId,
  bookingStatus,
}: IUpdateBookingStatus) => {
  try {
    const result = await updateStatus({
      userId,
      bookingId,
      bookingStatus,
    })

    return result
  } catch (error) {
    throw error
  }
}
