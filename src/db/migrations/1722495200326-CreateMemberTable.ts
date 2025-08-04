import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMemberTable1722495200326 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE IF NOT EXISTS member (
                id                  UUID                            DEFAULT gen_random_uuid()   NOT NULL,
                user_name           VARCHAR(30)                                                 NOT NULL,
                email               TEXT                                                        NOT NULL,
                password            VARCHAR(72)                                                 NOT NULL,
                avatar              TEXT                                                        NOT NULL,
                gender              CHAR(1)                                                     NOT NULL,
                country             CHAR(2)                                                     NOT NULL,
                title               VARCHAR(100)                                                NOT NULL,
                company             VARCHAR(100)                                                NOT NULL,
                phone_number        CHAR(10)                                                    NOT NULL,
                email_otp           BOOLEAN                         DEFAULT FALSE               NOT NULL,
                introduction        TEXT                                                        NOT NULL,
                level               SMALLINT                                                    NOT NULL,
                field_of_work       JSONB                                                       NOT NULL,
                created_at          TIMESTAMP WITHOUT TIME ZONE     DEFAULT NOW()               NOT NULL,
                updated_at          TIMESTAMP WITHOUT TIME ZONE     DEFAULT NOW()               NOT NULL,
                PRIMARY KEY(id),
                UNIQUE(email)
            );

            COMMENT ON TABLE member IS 'Member table';
            COMMENT ON COLUMN member.id IS 'Member UUID';
            COMMENT ON COLUMN member.user_name IS 'Member user name';
            COMMENT ON COLUMN member.email IS 'Member email';
            COMMENT ON COLUMN member.password IS 'Member password';
            COMMENT ON COLUMN member.avatar IS 'Member avatar';
            COMMENT ON COLUMN member.gender IS 'Member gender m: male f: female n: unknown';
            COMMENT ON COLUMN member.country IS 'Member country (ISO 3166-1 alpha-2)';
            COMMENT ON COLUMN member.title IS 'Member title';
            COMMENT ON COLUMN member.company IS 'Member company';
            COMMENT ON COLUMN member.phone_number IS 'Member phone number';
            COMMENT ON COLUMN member.email_otp IS 'Member email otp verification state';
            COMMENT ON COLUMN member.introduction IS 'Member introduction';
            COMMENT ON COLUMN member.level IS 'Member level of experience 0:Intermediate, 1:Senior, 2:Manager, 3:Director, 4:Lead, 5:Executive, 6:Founder';
            COMMENT ON COLUMN member.field_of_work IS 'Member field of work';
            COMMENT ON COLUMN member.created_at IS 'Member created time';
            COMMENT ON COLUMN member.updated_at IS 'Member Updated time';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DROP TABLE member;
        `);
  }
}
