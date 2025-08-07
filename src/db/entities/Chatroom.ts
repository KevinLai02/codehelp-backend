import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './Member';
import { Mentor } from './Mentor';
import { Message } from './Message';

@Entity('chatroom', { schema: 'public' })
export class Chatroom extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(
    () => Member,
    (member) => member.chatrooms,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn([{ name: 'member_id', referencedColumnName: 'id' }])
  member: Member;

  @ManyToOne(
    () => Mentor,
    (mentor) => mentor.chatrooms,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn([{ name: 'mentor_id', referencedColumnName: 'id' }])
  mentor: Mentor;

  @OneToMany(
    () => Message,
    (message) => message.chatroom
  )
  messages: Message[];
}
