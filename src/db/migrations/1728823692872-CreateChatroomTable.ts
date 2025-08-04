import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChatroomTable1728823692872 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS chatroom (
                id                  UUID                            DEFAULT gen_random_uuid()   NOT NULL,
                mentor_id           UUID                                                        NOT NULL,
                member_id           UUID                                                        NOT NULL,
                created_at          TIMESTAMP WITHOUT TIME ZONE     DEFAULT NOW()               NOT NULL,
                PRIMARY KEY(id),
                CONSTRAINT fk_chatroom_member FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE,
                CONSTRAINT fk_chatroom_mentor FOREIGN KEY (mentor_id) REFERENCES mentor(id) ON DELETE CASCADE
            );

            COMMENT ON TABLE chatroom IS 'Chatroom table';
            COMMENT ON COLUMN chatroom.id IS 'Chatroom UUID';
            COMMENT ON COLUMN chatroom.mentor_id IS 'Mentor UUID who is in this chatroom';
            COMMENT ON COLUMN chatroom.member_id IS 'Member UUID who is in this chatroom';
            COMMENT ON COLUMN chatroom.created_at IS 'Chatroom create time';
        `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE chatroom;
        `);
  }
}
