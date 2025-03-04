import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { Chatroom } from "./Chatroom"
import { ColumnTypeAdapter } from "../utils/ColumnTypeAdapter"

@Entity("message", { schema: "public" })
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ColumnTypeAdapter("uuid", { name: "user_id" })
  userId: string

  @ColumnTypeAdapter("text", { name: "content" })
  content: string

  @CreateDateColumn()
  created_at: Date

  @ManyToOne(() => Chatroom, (chatroom) => chatroom.messages, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "chatroom_id", referencedColumnName: "id" }])
  chatroom: Chatroom
}
