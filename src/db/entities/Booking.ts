import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ColumnTypeAdapter } from '../utils/ColumnTypeAdapter';
import { BookingMember } from './BookingMember';
import { Mentor } from './Mentor';

@Entity('booking', { schema: 'public' })
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ColumnTypeAdapter('uuid', { name: 'host_id', nullable: false })
  hostId: string;

  @ColumnTypeAdapter('character varying', {
    name: 'topic',
    length: 30,
    default: 'Blank',
  })
  topic: string;

  @ColumnTypeAdapter('text', { name: 'question' })
  question: string;

  @ColumnTypeAdapter('varchar', {
    name: 'picture',
    nullable: true,
    array: true,
  })
  picture: string[] | string;

  @ColumnTypeAdapter('smallint', { name: 'booking_status', default: '0' })
  bookingStatus: number;

  @ColumnTypeAdapter('timestamp without time zone', { name: 'booking_at' })
  bookingAt: Date;

  @ColumnTypeAdapter('smallint', { name: 'duration' })
  duration: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(
    () => Mentor,
    (mentor) => mentor.bookings,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn([{ name: 'host_id', referencedColumnName: 'id' }])
  host?: Mentor;

  @OneToMany(
    () => BookingMember,
    (bookingMember) => bookingMember.booking
  )
  bookingMembers?: BookingMember[];
}
