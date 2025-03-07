CREATE TABLE message (
    id                  UUID                            DEFAULT gen_random_uuid()   NOT NULL,
    chatroom_id         UUID                                                        NOT NULL,
    user_id             UUID                                                        NOT NULL,
    "type"              SMALLINT                        DEFAULT 0                   NOT NULL,
    content             TEXT                                                        NOT NULL,
    created_at          TIMESTAMP WITHOUT TIME ZONE     DEFAULT NOW()               NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_message_chatroom FOREIGN KEY (chatroom_id) REFERENCES chatroom(id) ON DELETE CASCADE
);

COMMENT ON TABLE message IS 'Message table';
COMMENT ON COLUMN message.id IS 'Message UUID';
COMMENT ON COLUMN message.chatroom_id IS 'Chatroom UUID which is this message belong';
COMMENT ON COLUMN message.user_id IS 'Sender UUID who send this message';
COMMENT ON COLUMN message.type IS 'The message type 0: normal, 1: booking record';
COMMENT ON COLUMN message.content IS 'The message content';
COMMENT ON COLUMN message.created_at IS 'message create time';