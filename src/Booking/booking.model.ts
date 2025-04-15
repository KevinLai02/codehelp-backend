import { Booking } from "~/db/entities/Booking"
import {
  ICheckIsBooked,
  IBookingRecord,
  IGetBookingRecordsModel,
  INewBookingMemberModel,
  INewBookingModel,
  IUpdateBookingStatus,
  IBookingCompleteModel,
} from "./types"
import { BookingMember } from "~/db/entities/BookingMember"
import dataSource from "~/db/dataSource"
import testDataSource from "~/db/testDataSource"

export const addBooking = ({
  host,
  topic,
  question,
  bookingTime,
  picture,
  duration,
}: INewBookingModel) => {
  const newBooking = new Booking()
  newBooking.host = host
  newBooking.topic = topic
  newBooking.question = question
  newBooking.bookingAt = bookingTime
  newBooking.duration = duration
  newBooking.picture = picture
  return newBooking.save()
}

export const addBookingMember = (
  BookingMemberRecord: INewBookingMemberModel[],
) => {
  const currentDataSource =
    process.env.NODE_ENV === "test" ? testDataSource : dataSource
  const BookingMemberRepo = currentDataSource.getRepository(BookingMember)
  return BookingMemberRepo.save(BookingMemberRecord)
}

export const checkIsBooked = ({ hostId, bookingTime }: ICheckIsBooked) => {
  return Booking.existsBy({
    host: { id: hostId },
    bookingAt: bookingTime,
  })
}

export const findBookingRecords = ({
  userId,
  count,
  skip,
}: IGetBookingRecordsModel) => {
  return Booking.createQueryBuilder("booking")
    .leftJoinAndMapMany(
      "booking.memberList",
      "booking.bookingMembers",
      "booking_member",
    )
    .leftJoinAndSelect("booking_member.member", "member")
    .where("booking.host_id = :userId", { userId })
    .orWhere(
      "booking.id IN (SELECT booking_id FROM booking_member WHERE member_id = :userId)",
      { userId },
    )
    .take(count)
    .skip(skip)
    .getManyAndCount()
}

export const findBookingRecord = ({ userId, bookingId }: IBookingRecord) => {
  return Booking.createQueryBuilder("booking")
    .leftJoinAndMapMany(
      "booking.memberList",
      "booking.bookingMembers",
      "booking_member",
    )
    .leftJoinAndSelect("booking_member.member", "member")
    .where("booking.host_id = :userId AND booking.id = :bookingId", {
      userId,
      bookingId,
    })
    .orWhere(
      "booking.id IN (SELECT booking_id FROM booking_member WHERE member_id = :userId) AND booking.id = :bookingId",
      { userId, bookingId },
    )
    .getOne()
}

export const deleteOne = ({ userId, bookingId }: IBookingRecord) => {
  return Booking.createQueryBuilder("booking")
    .where("booking.host_id = :userId AND booking.id = :bookingId", {
      userId,
      bookingId,
    })
    .orWhere(
      "booking.id IN (SELECT booking_id FROM booking_member WHERE member_id = :userId AND booking_id = :bookingId)",
      {
        userId,
        bookingId,
      },
    )
    .delete()
    .execute()
}

export const updateStatusByHostAndBookingId = ({
  hostId,
  bookingId,
  bookingStatus,
}: IUpdateBookingStatus) => {
  return Booking.createQueryBuilder("booking")
    .where("booking.host_id = :hostId", {
      hostId,
    })
    .andWhere("booking.id = :bookingId", { bookingId })
    .update({ bookingStatus })
    .execute()
}

export const findBookingBy = ({
  memberId,
  bookingId,
}: {
  memberId: string
  bookingId: string
}) => {
  return BookingMember.createQueryBuilder("bookingMember")
    .where("booking_id = :bookingId", { bookingId })
    .andWhere("member_id = :memberId", { memberId })
    .getOne()
}

export const updateStatusByBookingId = ({
  bookingId,
  bookingStatus,
}: IBookingCompleteModel) => {
  return Booking.createQueryBuilder("booking")
    .where("booking.id = :bookingId", {
      bookingId,
    })
    .update({ bookingStatus })
    .execute()
}
