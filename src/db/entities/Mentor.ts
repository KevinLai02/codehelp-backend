import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ColumnTypeAdapter } from '../utils/ColumnTypeAdapter';
import { Booking } from './Booking';
import { Chatroom } from './Chatroom';
import { MentorAvailableTime } from './MentorAvailableTime';
import { MentorDisciplines } from './MentorDisciplines';
import { MentorSkills } from './MentorSkills';
import { MentorTools } from './MentorTools';

@Entity('mentor', { schema: 'public' })
export class Mentor extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ColumnTypeAdapter('character varying', {
    name: 'user_name',
    length: 30,
  })
  userName: string;

  @ColumnTypeAdapter('text', { name: 'email', unique: true })
  email: string;

  @ColumnTypeAdapter('character varying', {
    name: 'password',
    length: 72,
  })
  password?: string;

  @ColumnTypeAdapter('text', { name: 'avatar' })
  avatar: string;

  @ColumnTypeAdapter('character', { name: 'gender', length: 1 })
  gender: string;

  @ColumnTypeAdapter('character', { name: 'country', length: 2 })
  country: string;

  @ColumnTypeAdapter('character varying', { name: 'title', length: 100 })
  title: string;

  @ColumnTypeAdapter('character varying', {
    name: 'company',
    length: 100,
  })
  company: string;

  @ColumnTypeAdapter('character', { name: 'phone_number', length: 20 })
  phoneNumber: string;

  @ColumnTypeAdapter('boolean', { name: 'email_otp', default: false })
  emailOtp: boolean;

  @ColumnTypeAdapter('text', { name: 'introduction' })
  introduction: string;

  @ColumnTypeAdapter('smallint', { name: 'level', default: 0 })
  level: number;

  @ColumnTypeAdapter('text', { name: 'url' })
  url: string;

  @ColumnTypeAdapter('character varying', {
    name: 'primary_expertise',
    length: 100,
  })
  primaryExpertise: string;

  @ColumnTypeAdapter('character varying', {
    name: 'secondary_expertise',
    length: 100,
    default: () => "''",
  })
  secondaryExpertise?: string;

  @ColumnTypeAdapter('character varying', {
    name: 'tertiary_expertise',
    length: 100,
    default: () => "''",
  })
  tertiaryExpertise?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ColumnTypeAdapter('boolean', { name: 'quick_reply', default: false })
  quickReply?: boolean;

  @ColumnTypeAdapter('jsonb', { name: 'experience', default: '[]' })
  experience: object;

  @ColumnTypeAdapter('character varying', {
    name: 'education',
    length: 50,
    default: '',
  })
  education: string;

  @OneToMany(
    () => Booking,
    (booking) => booking.host
  )
  bookings: Booking[];

  @OneToMany(
    () => Chatroom,
    (chatroom) => chatroom.mentor
  )
  chatrooms: Chatroom[];

  @OneToMany(
    () => MentorAvailableTime,
    (mentorAvailableTime) => mentorAvailableTime.mentor
  )
  mentorAvailableTimes: MentorAvailableTime[];

  @OneToMany(
    () => MentorDisciplines,
    (mentorDisciplines) => mentorDisciplines.mentor
  )
  mentorDisciplines: MentorDisciplines[];

  @OneToMany(
    () => MentorSkills,
    (mentorSkills) => mentorSkills.mentor
  )
  mentorSkills: MentorSkills[];

  @OneToMany(
    () => MentorTools,
    (mentorTools) => mentorTools.mentor
  )
  mentorTools: MentorTools[];

  toJSON() {
    this.password = undefined;
    return this;
  }
}
