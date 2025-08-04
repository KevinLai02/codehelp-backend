import type { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyPhoneNumberLength1728821843321
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE mentor 
            ALTER COLUMN phone_number TYPE CHAR(20);

            ALTER TABLE member 
            ALTER COLUMN phone_number TYPE CHAR(20);
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE mentor 
        ALTER COLUMN phone_number TYPE CHAR(10);

        ALTER TABLE member 
        ALTER COLUMN phone_number TYPE CHAR(10);
    `);
  }
}
