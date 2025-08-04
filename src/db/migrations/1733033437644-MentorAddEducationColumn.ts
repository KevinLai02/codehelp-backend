import type { MigrationInterface, QueryRunner } from 'typeorm';

export class MentorAddEducationColumn1733033437644
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE mentor
            ADD education varchar(50) DEFAULT '' NOT NULL;

            COMMENT ON COLUMN mentor.education IS 'Mentor education';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE mentor
            DROP COLUMN education;
        `);
  }
}
