import type { MigrationInterface, QueryRunner } from 'typeorm';

export class MentorAddExperienceColumn1732552231121
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE mentor
            ADD experience JSONB DEFAULT '[]'::JSONB NOT NULL;

            COMMENT ON COLUMN mentor.experience IS 'Contain company title, name, and description.';
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE mentor
            DROP COLUMN experience;
        `);
  }
}
