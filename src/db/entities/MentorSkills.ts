import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm"
import { Mentor } from "./Mentor"
import { MENTOR_SKILLS } from "~/Mentor/types"
@Index("mentor_skills_pkey", ["id"], { unique: true })
@Index("mentor_skills_mentor_id_skill_key", ["mentorId", "skill"], {
  unique: true,
})
@Entity("mentor_skills", { schema: "public" })
export class MentorSkills extends BaseEntity {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id?: string

  @Column("uuid", { name: "mentor_id", unique: true })
  mentorId?: string

  @Column("enum", {
    name: "skill",
    unique: true,
    enum: MENTOR_SKILLS,
  })
  skill?: MENTOR_SKILLS

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt?: Date

  @ManyToOne(() => Mentor, (mentor) => mentor.mentorSkills, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "mentor_id", referencedColumnName: "id" }])
  mentor?: Mentor
}
