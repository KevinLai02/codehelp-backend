CREATE TYPE WEEK_DAYS AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

CREATE TABLE mentor_available_time (
    id          UUID        DEFAULT gen_random_uuid(),
    mentor_id   UUID                                        NOT NULL,
    "day"       WEEK_DAYS                                   NOT NULL,
    time_code   INTEGER[]                                   NOT NULL,
    CONSTRAINT fk_mentor_available_time FOREIGN KEY (mentor_id) REFERENCES mentor(id) ON DELETE CASCADE,
    PRIMARY KEY(id),
    UNIQUE(mentor_id, "day"),
    CONSTRAINT check_time_code CHECK (
        time_code <@ ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
    )
);

COMMENT ON TABLE mentor_available_time IS 'The mentor selected available times for the booking';
COMMENT ON TYPE WEEK_DAYS IS 'An abbreviation for the days of the week, used in the weekly column type';
COMMENT ON COLUMN mentor_available_time.id IS 'The available time UUID';
COMMENT ON COLUMN mentor_available_time.mentor_id IS 'Mentor UUID to which the available time belongs';
COMMENT ON COLUMN mentor_available_time.day IS 'The day of the week, stored as an abbreviation (e.g., mon, tue, wed), using the WEEK_DAYS enum to ensure valid values.';
COMMENT ON COLUMN mentor_available_time.time_code IS 'An array representing available time slots within 24 hours (e.g., [1,2,4,6,8,24]).';
COMMENT ON CONSTRAINT check_time_code ON mentor_available_time IS 'Make sure the value of the time_code array is 1-24';