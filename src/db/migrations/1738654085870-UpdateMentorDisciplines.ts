import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateMentorDisciplines1738654085870
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TYPE DISCIPLINES AS ENUM (
                'Computer Science',
                'Engineering',
                'Business Administration',
                'Medicine',
                'Law',
                'Design',
                'Psychology',
                'Biology',
                'Economics',
                'Sociology'
            );

            ALTER TABLE mentor DROP COLUMN disciplines;

            CREATE TABLE mentor_disciplines(
                id                  UUID                            DEFAULT gen_random_uuid()   NOT NULL,
                mentor_id           UUID                                                        NOT NULL,
                disciplines         DISCIPLINES                                                 NOT NULL,
                created_at          TIMESTAMP WITHOUT TIME ZONE     DEFAULT NOW()               NOT NULL,
                CONSTRAINT fk_mentor_disciplines FOREIGN KEY (mentor_id) REFERENCES mentor(id) ON DELETE CASCADE,
                PRIMARY KEY(id),
                UNIQUE(mentor_id, disciplines)
            );

            COMMENT ON TABLE mentor_disciplines IS 'The mentor selected disciplines for the profile';
            COMMENT ON TYPE DISCIPLINES IS 'All options of disciplines, used in the disciplines column type';
            COMMENT ON COLUMN mentor_disciplines.mentor_id IS 'The UUID of the mentor associated with a specific discipline'; 
            COMMENT ON COLUMN mentor_disciplines.disciplines IS 'The discipline that the mentor specializes in, using the DISCIPLINES enum to ensure valid values';
            COMMENT ON COLUMN mentor_disciplines.created_at IS 'The mentor_discipline create time';
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
          DROP TABLE IF EXISTS mentor_disciplines;
          DROP TYPE IF EXISTS DISCIPLINES;
          ALTER TABLE mentor ADD COLUMN disciplines JSONB NOT NULL;
    `)
  }
}
