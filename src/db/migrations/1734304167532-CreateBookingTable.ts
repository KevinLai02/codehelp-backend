import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBookingTable1734304167532 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE booking (
                id                  UUID                            DEFAULT gen_random_uuid(),
                host_id             UUID                                                        NOT NULL,
                topic               VARCHAR(30)                     DEFAULT 'Blank',
                question            TEXT                                                        NOT NULL,
                picture             VARCHAR(200)[]                  DEFAULT '{}',
                booking_status      SMALLINT                        DEFAULT 0                   NOT NULL,
                booking_at          TIMESTAMP WITHOUT TIME ZONE                                 NOT NULL,
                duration            SMALLINT                                                    NOT NULL,
                created_at          TIMESTAMP WITHOUT TIME ZONE     DEFAULT NOW(),
                PRIMARY KEY(id),
                CONSTRAINT fk_booking_mentor FOREIGN KEY (host_id) REFERENCES mentor(id) ON DELETE CASCADE
            );

            COMMENT ON TABLE booking IS 'Booking table';
            COMMENT ON COLUMN booking.id IS 'Booking UUID';
            COMMENT ON COLUMN booking.host_id IS 'Which mentor is booked';
            COMMENT ON COLUMN booking.topic IS 'The question topic';
            COMMENT ON COLUMN booking.question IS 'The question content';
            COMMENT ON COLUMN booking.picture IS 'The question detail screenshot';
            COMMENT ON COLUMN booking.booking_status IS 'The stage of this booking 0: request 1: accept 2: reject 3: request cancel 4: finish';
            COMMENT ON COLUMN booking.booking_at IS 'The member booking time';
            COMMENT ON COLUMN booking.duration IS 'The course duration';
            COMMENT ON COLUMN booking.created_at IS 'Booking create time';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DROP TABLE booking;
        `);
  }
}
