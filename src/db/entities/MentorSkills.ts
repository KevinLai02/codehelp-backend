import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MENTOR_SKILLS } from '~/Mentor/types';
import { ColumnTypeAdapter } from '../utils/ColumnTypeAdapter';
import { Mentor } from './Mentor';

@Index('mentor_skills_mentor_id_skill_key', ['mentorId', 'skill'], {
  unique: true,
})
@Entity('mentor_skills', { schema: 'public' })
export class MentorSkills extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ColumnTypeAdapter('uuid', { name: 'mentor_id' })
  mentorId: string;

  @ColumnTypeAdapter('enum', {
    name: 'skill',
    enum: MENTOR_SKILLS,
  })
  skill: MENTOR_SKILLS;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(
    () => Mentor,
    (mentor) => mentor.mentorSkills,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn([{ name: 'mentor_id', referencedColumnName: 'id' }])
  mentor: Mentor;
}
