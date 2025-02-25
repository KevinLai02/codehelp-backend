import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm"
import { Mentor } from "./Mentor"
import { MENTOR_TOOLS } from "~/Mentor/types"

@Index("mentor_tools_pkey", ["id"], { unique: true })
@Index("mentor_tools_mentor_id_tool_key", ["mentorId", "tool"], {
  unique: true,
})
@Entity("mentor_tools", { schema: "public" })
export class MentorTools extends BaseEntity {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "gen_random_uuid()",
  })
  id?: string

  @Column("uuid", { name: "mentor_id", unique: true })
  mentorId?: string

  @Column("enum", {
    name: "tool",
    unique: true,
    enum: MENTOR_TOOLS,
  })
  tool?: MENTOR_TOOLS

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt?: Date

  @ManyToOne(() => Mentor, (mentor) => mentor.mentorTools, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "mentor_id", referencedColumnName: "id" }])
  mentor?: Mentor
}
