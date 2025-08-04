import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMentorSkills1739172042016 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE SKILLS AS ENUM (
                'HTML',
                'CSS',
                'JavaScript',
                'TypeScript',
                'React',
                'Vue.js',
                'Angular',
                'Node.js',
                'Express.js',
                'Python',
                'Django',
                'Flask',
                'Ruby',
                'Ruby on Rails',
                'Java',
                'Spring',
                'PHP',
                'Laravel',
                'C#',
                'ASP.NET',
                'Swift',
                'Kotlin',
                'Flutter',
                'React Native',
                'SQL',
                'NoSQL',
                'Git',
                'Docker',
                'Kubernetes',
                'CI/CD',
                'Machine Learning',
                'Data Analysis',
                'UI/UX Design',
                'Adobe Photoshop',
                'Sketch',
                'Figma',
                'InVision',
                'Prototyping',
                'Cybersecurity'
            );

            ALTER TABLE mentor DROP COLUMN skills;

            CREATE TABLE mentor_skills(
                id                  UUID                            DEFAULT gen_random_uuid()   NOT NULL,
                mentor_id           UUID                                                        NOT NULL,
                skill               SKILLS                                                      NOT NULL,
                created_at          TIMESTAMP WITHOUT TIME ZONE     DEFAULT NOW()               NOT NULL,
                CONSTRAINT fk_mentor_skill FOREIGN KEY (mentor_id) REFERENCES mentor(id) ON DELETE CASCADE,
                PRIMARY KEY(id),
                UNIQUE(mentor_id, skill)
            );

            COMMENT ON TABLE mentor_skills IS 'The mentor selected skills for the profile';
            COMMENT ON TYPE SKILLS IS 'All options of skills, used in the skill column type';
            COMMENT ON COLUMN mentor_skills.mentor_id IS 'The UUID of the mentor associated with a specific skill'; 
            COMMENT ON COLUMN mentor_skills.skill IS 'The skill that the mentor specializes in, using the SKILLS enum to ensure valid values';
            COMMENT ON COLUMN mentor_skills.created_at IS 'The mentor_skills create time';
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS mentor_skills;
            DROP TYPE IF EXISTS SKILLS;
            ALTER TABLE mentor ADD COLUMN skills JSONB DEFAULT '[]'::JSONB NOT NULL;
    `);
  }
}
