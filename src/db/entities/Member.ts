import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { ColumnTypeAdapter } from "../utils/ColumnTypeAdapter"
import { BookingMember } from "./BookingMember"
import { Chatroom } from "./Chatroom"

@Entity("member", { schema: "public" })
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ColumnTypeAdapter("character varying", {
    name: "user_name",
    length: 30,
  })
  userName: string

  @ColumnTypeAdapter("text", { name: "email", unique: true })
  email: string

  @ColumnTypeAdapter("character varying", {
    name: "password",
    length: 72,
  })
  password?: string

  @ColumnTypeAdapter("text", { name: "avatar" })
  avatar: string

  @ColumnTypeAdapter("character", { name: "gender", length: 1 })
  gender: string

  @ColumnTypeAdapter("character", { name: "country", length: 2 })
  country: string

  @ColumnTypeAdapter("character varying", { name: "title", length: 100 })
  title: string

  @ColumnTypeAdapter("character varying", {
    name: "company",
    length: 100,
  })
  company: string

  @ColumnTypeAdapter("character", { name: "phone_number", length: 20 })
  phoneNumber: string

  @ColumnTypeAdapter("boolean", { name: "email_otp", default: false })
  emailOtp: boolean

  @ColumnTypeAdapter("text", { name: "introduction" })
  introduction: string

  @ColumnTypeAdapter("smallint", { name: "level" })
  level: number

  @ColumnTypeAdapter("jsonb", { name: "field_of_work" })
  fieldOfWork: object | string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => BookingMember, (bookingMember) => bookingMember.member)
  bookingMembers?: BookingMember[]

  @OneToMany(() => Chatroom, (chatroom) => chatroom.member)
  chatrooms?: Chatroom[]

  toJSON() {
    delete this.password
    return this
  }
}
