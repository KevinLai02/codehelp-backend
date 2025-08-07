import {
  BaseEntity,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ColumnTypeAdapter } from '../utils/ColumnTypeAdapter';
import { Booking } from './Booking';
import { Member } from './Member';

@Index('booking_member_booking_id_member_id_key', ['bookingId', 'memberId'], {
  unique: true,
})
@Entity('booking_member', { schema: 'public' })
export class BookingMember extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ColumnTypeAdapter('uuid', { name: 'booking_id' })
  bookingId: string;

  @ColumnTypeAdapter('uuid', { name: 'member_id' })
  memberId: string;

  @ManyToOne(
    () => Booking,
    (booking) => booking.bookingMembers,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn([{ name: 'booking_id', referencedColumnName: 'id' }])
  booking: Booking;

  @ManyToOne(
    () => Member,
    (member) => member.bookingMembers,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn([{ name: 'member_id', referencedColumnName: 'id' }])
  member: Member;
}
