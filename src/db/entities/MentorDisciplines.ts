import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm"
import { Mentor } from "./Mentor"
import { MENTOR_DISCIPLINES } from "~/Mentor/types"

@Index(
  "mentor_disciplines_mentor_id_discipline_key",
  ["discipline", "mentorId"],
  { unique: true },
)
@Index("mentor_disciplines_pkey", ["id"], { unique: true })
@Entity("mentor_disciplines", { schema: "public" })
export class MentorDisciplines extends BaseEntity {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id?: string

  @Column("uuid", { name: "mentor_id", unique: true })
  mentorId?: string

  @Column("enum", {
    name: "discipline",
    unique: true,
    enum: MENTOR_DISCIPLINES,
  })
  discipline?: MENTOR_DISCIPLINES

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt?: Date

  @ManyToOne(() => Mentor, (mentor) => mentor.mentorDisciplines, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "mentor_id", referencedColumnName: "id" }])
  mentor?: Mentor
}
