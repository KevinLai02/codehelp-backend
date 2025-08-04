export enum MESSAGE_TYPE {
  NORMAL = 0,
  BOOKING_RECORD = 1,
}

export interface IGetMessageRecords {
  userId: string;
  chatroomId: string;
  page: number;
  count: number;
}

export interface IGetMessageRecordsModel {
  chatroomId: string;
  skip: number;
  count: number;
}
