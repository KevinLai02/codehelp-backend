import { BaseEntity, Column, Entity, Index, OneToMany } from "typeorm"
import { Chatroom } from "./Chatroom"
import { MentorDisciplines } from "./MentorDisciplines"
import { MentorSkills } from "./MentorSkills"
import { MentorTools } from "./MentorTools"

@Index("mentor_email_key", ["email"], { unique: true })
@Index("mentor_pkey", ["id"], { unique: true })
@Entity("mentor", { schema: "public" })
export class Mentor extends BaseEntity {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id?: string

  @Column("character varying", { name: "user_name", length: 30 })
  userName?: string

  @Column("text", { name: "email", unique: true })
  email?: string

  @Column("character varying", { name: "password", length: 72 })
  password?: string

  @Column("text", { name: "avatar" })
  avatar?: string

  @Column("character", { name: "gender", length: 1 })
  gender?: string

  @Column("character", { name: "country", length: 2 })
  country?: string

  @Column("character varying", { name: "title", length: 100 })
  title?: string

  @Column("character varying", { name: "company", length: 100 })
  company?: string

  @Column("character", { name: "phone_number", length: 20 })
  phoneNumber?: string

  @Column("boolean", { name: "email_otp", default: () => "false" })
  emailOtp?: boolean

  @Column("text", { name: "introduction" })
  introduction?: string

  @Column("smallint", { name: "level", default: () => "0" })
  level?: number

  @Column("text", { name: "url" })
  url?: string

  @Column("character varying", { name: "primary_expertise", length: 100 })
  primaryExpertise?: string

  @Column("character varying", {
    name: "secondary_expertise",
    length: 100,
    default: () => "''",
  })
  secondaryExpertise?: string

  @Column("character varying", {
    name: "tertiary_expertise",
    length: 100,
    default: () => "''",
  })
  tertiaryExpertise?: string

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt?: Date

  @Column("timestamp without time zone", {
    name: "updated_at",
    default: () => "now()",
  })
  updatedAt?: Date

  @Column("boolean", { name: "quick_reply", default: () => "false" })
  quickReply?: boolean

  @Column("jsonb", { name: "experience", default: [] })
  experience?: object

  @Column("character varying", {
    name: "education",
    length: 50,
    default: () => "''",
  })
  education?: string

  @OneToMany(() => Chatroom, (chatroom) => chatroom.mentor)
  chatrooms?: Chatroom[]

  @OneToMany(
    () => MentorDisciplines,
    (mentorDisciplines) => mentorDisciplines.mentor,
  )
  mentorDisciplines?: MentorDisciplines[]

  @OneToMany(() => MentorSkills, (mentorSkills) => mentorSkills.mentor)
  mentorSkills?: MentorSkills[]

  @OneToMany(() => MentorTools, (mentorTools) => mentorTools.mentor)
  mentorTools?: MentorTools[]
}
