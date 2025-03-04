import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
} from "typeorm"
import { Mentor } from "./Mentor"
import { MENTOR_DISCIPLINES } from "~/Mentor/types"
import { ColumnTypeAdapter } from "../utils/ColumnTypeAdapter"

@Index(
  "mentor_disciplines_mentor_id_discipline_key",
  ["discipline", "mentorId"],
  { unique: true },
)
@Entity("mentor_disciplines", { schema: "public" })
export class MentorDisciplines extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ColumnTypeAdapter("uuid", { name: "mentor_id" })
  mentorId: string

  @ColumnTypeAdapter("enum", {
    name: "discipline",
    enum: MENTOR_DISCIPLINES,
  })
  discipline: MENTOR_DISCIPLINES

  @CreateDateColumn()
  created_at: Date

  @ManyToOne(() => Mentor, (mentor) => mentor.mentorDisciplines, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "mentor_id", referencedColumnName: "id" }])
  mentor: Mentor
}
