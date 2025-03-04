import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateBookingMemberTable1739000712002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE booking_member (
                id          UUID    DEFAULT gen_random_uuid(),
                booking_id  UUID                                NOT NULL,
                member_id   UUID                                NOT NULL,
                PRIMARY KEY(id),
                UNIQUE(booking_id, member_id),
                CONSTRAINT fk_booking_member_id FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE,
                CONSTRAINT fk_booking FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE
            );

            COMMENT ON TABLE booking_member IS 'The table records which members made the booking';
            COMMENT ON COLUMN booking_member.id IS 'The record UUID';
            COMMENT ON COLUMN booking_member.booking_id IS 'The booking record which is member join';
            COMMENT ON COLUMN booking_member.member_id IS 'Which members made the booking';
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DROP TABLE booking_member;
        `)
  }
}
