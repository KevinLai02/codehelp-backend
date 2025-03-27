import { Request, Response } from "express"

export enum RESPONSE_CODE {
  VALIDATE_ERROR = "4001",
  USER_DATA_ERROR = "4002",
  DATA_DUPLICATE = "4003",
  TARGET_NOT_EXISTS = "4004",
  NO_PERMISSION = "4005",
  UNKNOWN_ERROR = "5000",
}

export enum GENDER {
  "MALE" = "m",
  "FEMALE" = "f",
  "UNKNOWN" = "n",
}

export interface IAccount {
  email: string
  password: string
}

export interface IPagination {
  page: number
  count: number
}
export interface IIce_candidate {
  label: number | null
  id: string | null
  candidate: string
}
export interface ServerToClientEvents {
  offer: (description: RTCSessionDescription, remoteId: string) => void
  answer: (description: RTCSessionDescription, remoteId: string) => void
  ice_candidate: (data: IIce_candidate, remoteId: string) => void
  ready: (socketId: string, members: string[]) => void
  leave: (remoteId: string) => void
  remoteStartShare: (remoteId: string) => void
  remoteStopShare: (remoteId: string) => void
  receiveMessage: (messageData: IMessageData) => void
}
export interface ClientToServerEvents {
  join: (roomId: string) => void
  offer: (
    desc: RTCSessionDescription,
    remoteId: string,
    localId: string,
  ) => void
  answer: (
    desc: RTCSessionDescription,
    remoteId: string,
    localId: string,
  ) => void
  ice_candidate: (
    data: IIce_candidate,
    remoteId: string,
    localId: string,
  ) => void
  hangup: (room: string, remoteId: string) => void
  remoteStartShare: (roomID: string, remoteId: string) => void
  remoteStopShare: (roomID: string, remoteId: string) => void
  sendMessage: (messageData: IMessageData) => void
}

export interface IMessageData {
  id: string
  user: {
    id: string
    userName: string
    avatar: string
  }
  roomId: string
  content: string
  createdAt: string
  type: number
}

export interface IApi {
  (req: Request, res: Response): void
}

export interface IFeatureError {
  status: string
  code: RESPONSE_CODE
  message: string | unknown
}
