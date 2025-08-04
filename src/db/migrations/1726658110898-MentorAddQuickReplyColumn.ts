import type { MigrationInterface, QueryRunner } from 'typeorm';

export class MentorAddQuickReplyColumn1726658110898
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE mentor
            ADD quick_reply BOOLEAN DEFAULT false NOT NULL;

            COMMENT ON COLUMN mentor.quick_reply IS 'When true, the mentor should reply as soon as possible';
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE mentor
            DROP COLUMN quick_reply;
        `);
  }
}
