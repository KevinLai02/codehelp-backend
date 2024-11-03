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
  offer: (description: RTCSessionDescription) => void
  answer: (description: RTCSessionDescription) => void
  ice_candidate: (data: IIce_candidate) => void
  ready: () => void
  otherUserHangup: () => void
}
export interface ClientToServerEvents {
  join: (roomID: string) => void
  answer: (room: string, description: RTCSessionDescription) => void
  ice_candidate: (room: string, data: IIce_candidate) => void
  hangup: (room: string) => void
  offer: (room: string, description: RTCSessionDescription) => void
}
