import { Mentor } from "~/db/entities/Mentor"

export enum BOOKING_STATUS {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2,
  CANCEL = 3,
  COMPLETED = 4,
}

export const BOOKING_STATUS_LABELS: Record<BOOKING_STATUS | number, string> = {
  [BOOKING_STATUS.PENDING]: "申請中",
  [BOOKING_STATUS.REJECTED]: "已拒絕",
  [BOOKING_STATUS.ACCEPTED]: "已接受",
  [BOOKING_STATUS.CANCEL]: "已取消",
  [BOOKING_STATUS.COMPLETED]: "已結束",
}

export interface INewBookingModel {
  host: Mentor
  topic: string
  question: string
  bookingTime: Date
  duration: number
  picture: string[] | string
}

export interface INewBookingFeature {
  hostId: string
  memberId: string
  topic: string
  question: string
  bookingTime: Date
  duration: number
  memberIds: string[]
  picture: Express.Multer.File[]
}

export interface INewBookingMemberModel {
  memberId: string
  bookingId: string
}

export interface ICheckIsBooked {
  hostId: string
  bookingTime: Date
}

export interface IGetBookingRecordsFeature {
  page: number
  count: number
  userId: string
}

export interface IGetBookingRecordsModel {
  skip: number
  count: number
  userId: string
}

export interface IBookingRecord {
  userId: string
  bookingId: string
}
