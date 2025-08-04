import {
  BaseEntity,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { DAY_TYPE } from '~/Mentor/types';
import { ColumnTypeAdapter } from '../utils/ColumnTypeAdapter';
import { Mentor } from './Mentor';

@Index('mentor_available_time_mentor_id_day_key', ['day', 'mentorId'], {
  unique: true,
})
@Entity('mentor_available_time', { schema: 'public' })
export class MentorAvailableTime extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ColumnTypeAdapter('uuid', { name: 'mentor_id' })
  mentorId: string;

  @ColumnTypeAdapter('character', {
    name: 'day',
    length: 3,
  })
  day: DAY_TYPE;

  @ColumnTypeAdapter('int4', { name: 'time_code', array: true })
  timeCode: number[] | string;

  @ManyToOne(
    () => Mentor,
    (mentor) => mentor.mentorAvailableTimes,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn([{ name: 'mentor_id', referencedColumnName: 'id' }])
  mentor: Mentor;
}
