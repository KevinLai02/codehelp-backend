import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  Index,
} from "typeorm"
import { Mentor } from "./Mentor"
import { MENTOR_TOOLS } from "~/Mentor/types"
import { ColumnTypeAdapter } from "../utils/ColumnTypeAdapter"

@Index("mentor_tools_mentor_id_tool_key", ["mentorId", "tool"], {
  unique: true,
})
@Entity("mentor_tools", { schema: "public" })
export class MentorTools extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ColumnTypeAdapter("uuid", { name: "mentor_id" })
  mentorId: string

  @ColumnTypeAdapter("enum", {
    name: "tool",
    enum: MENTOR_TOOLS,
  })
  tool: MENTOR_TOOLS

  @CreateDateColumn()
  created_at: Date

  @ManyToOne(() => Mentor, (mentor) => mentor.mentorTools, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "mentor_id", referencedColumnName: "id" }])
  mentor: Mentor
}
