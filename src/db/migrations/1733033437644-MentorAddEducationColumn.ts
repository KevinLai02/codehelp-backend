import type { MigrationInterface, QueryRunner } from 'typeorm';

export class MentorAddEducationColumn1733033437644
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE mentor
            ADD education varchar(50) DEFAULT '' NOT NULL;

            COMMENT ON COLUMN mentor.education IS 'Mentor education';
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE mentor
            DROP COLUMN education;
        `);
  }
}
