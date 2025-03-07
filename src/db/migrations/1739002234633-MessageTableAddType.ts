import { MigrationInterface, QueryRunner } from "typeorm"

export class MessageTableAddType1739002234633 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE message
                ADD "type"  SMALLINT    DEFAULT 0   NOT NULL;

            COMMENT ON COLUMN message.type IS 'The message type 0: normal, 1: booking record';
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE message
                DROP COLUMN "type";
        `)
  }
}
