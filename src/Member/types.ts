export interface IMemberInfo {
  userName: string;
  gender: string;
  country: string;
  title: string;
  company: string;
  phoneNumber: string;
  emailOtp?: boolean;
  introduction: string;
  level: LEVEL_OF_EXPERIENCE;
  fieldOfWork: string[];
}

export interface IMember extends IMemberInfo {
  email: string;
  password: string;
}

export interface IMemberRequestBody extends IMember {
  avatar: Express.Multer.File[];
}

export interface IMemberModel extends IMember {
  avatar: string;
}

export const LEVEL_OF_EXPERIENCE = {
  Intermediate: 0,
  Senior: 1,
  Manager: 2,
  Director: 3,
  Lead: 4,
  Executive: 5,
  Founder: 6,
} as const;

export type LEVEL_OF_EXPERIENCE =
  (typeof LEVEL_OF_EXPERIENCE)[keyof typeof LEVEL_OF_EXPERIENCE];
