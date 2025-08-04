import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMentorTable1722495857833 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE IF NOT EXISTS mentor (
                id                      UUID                            DEFAULT gen_random_uuid()   NOT NULL,
                user_name               VARCHAR(30)                                                 NOT NULL,
                email                   TEXT                                                        NOT NULL,
                password                VARCHAR(72)                                                 NOT NULL,
                avatar                  TEXT                                                        NOT NULL,
                gender                  CHAR(1)                                                     NOT NULL,
                country                 CHAR(2)                                                     NOT NULL,
                title                   VARCHAR(100)                                                NOT NULL,
                company                 VARCHAR(100)                                                NOT NULL,
                phone_number            CHAR(10)                                                    NOT NULL,
                email_otp               BOOLEAN                         DEFAULT FALSE               NOT NULL,
                introduction            TEXT                                                        NOT NULL,
                level                   SMALLINT                        DEFAULT 0                   NOT NULL,
                url                     TEXT                                                        NOT NULL,
                primary_expertise       VARCHAR(100)                                                NOT NULL,
                secondary_expertise     VARCHAR(100)                    DEFAULT ''                  NOT NULL,
                tertiary_expertise      VARCHAR(100)                    DEFAULT ''                  NOT NULL,
                disciplines             JSONB                                                       NOT NULL,
                skills                  JSONB                                                       NOT NULL,
                tools                   JSONB                                                       NOT NULL,
                created_at              TIMESTAMP WITHOUT TIME ZONE     DEFAULT NOW()               NOT NULL,
                updated_at              TIMESTAMP WITHOUT TIME ZONE     DEFAULT NOW()               NOT NULL,
                PRIMARY KEY(id),
                UNIQUE(email)
            );

            COMMENT ON TABLE Mentor IS 'Mentor table';
            COMMENT ON COLUMN mentor.id IS 'Mentor UUID';
            COMMENT ON COLUMN mentor.user_name IS 'Mentor user name';
            COMMENT ON COLUMN mentor.email IS 'Mentor email';
            COMMENT ON COLUMN mentor.password IS 'Mentor password';
            COMMENT ON COLUMN mentor.avatar IS 'Mentor avatar';
            COMMENT ON COLUMN mentor.gender IS 'Mentor gender m: male f: female n: unknown';
            COMMENT ON COLUMN mentor.country IS 'Mentor country (ISO 3166-1 alpha-2)';
            COMMENT ON COLUMN mentor.title IS 'Mentor title';
            COMMENT ON COLUMN mentor.company IS 'Mentor company';
            COMMENT ON COLUMN mentor.phone_number IS 'Mentor phone number';
            COMMENT ON COLUMN mentor.email_otp IS 'Mentor email otp verification state';
            COMMENT ON COLUMN mentor.introduction IS 'Mentor introduction';
            COMMENT ON COLUMN mentor.level IS 'Mentor professional experience 0: no experience 1: 1~3(years) 2: 3~5(years) 3: over 5(years)';
            COMMENT ON COLUMN mentor.url IS 'Mentor linkedIn URL';
            COMMENT ON COLUMN mentor.primary_expertise IS 'Mentor primary expertise';
            COMMENT ON COLUMN mentor.secondary_expertise IS 'Mentor secondary expertise';
            COMMENT ON COLUMN mentor.tertiary_expertise IS 'Mentor tertiary expertise';
            COMMENT ON COLUMN mentor.disciplines IS 'Mentor disciplines';
            COMMENT ON COLUMN mentor.skills IS 'Mentor skills';
            COMMENT ON COLUMN mentor.tools IS 'Mentor tools';
            COMMENT ON COLUMN mentor.created_at IS 'Mentor created time';
            COMMENT ON COLUMN mentor.updated_at IS 'Mentor Updated time';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DROP TABLE mentor;
        `);
  }
}
