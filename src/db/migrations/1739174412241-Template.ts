import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateMentorTools1739174412241 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TYPE TOOLS AS ENUM (
                'React',
                'Vue.js',
                'Angular',
                'HTML',
                'CSS',
                'JavaScript',
                'Node.js',
                'Django',
                'Flask',
                'Ruby on Rails',
                'Spring',
                'Express.js',
                'MEAN Stack',
                'MERN Stack',
                'LAMP Stack',
                'GraphQL',
                'Firebase',
                'Figma',
                'Sketch',
                'Adobe XD',
                'InVision',
                'Axure RP',
                'Adobe Photoshop',
                'Adobe Illustrator',
                'CorelDRAW',
                'Affinity Designer',
                'Inkscape',
                'Docker',
                'Kubernetes',
                'Jenkins',
                'Ansible',
                'Terraform',
                'React Native',
                'Flutter',
                'Swift',
                'Kotlin',
                'Xamarin'
        );
    
        ALTER TABLE mentor DROP COLUMN tools;
    
        CREATE TABLE mentor_tools(
            id                  UUID                            DEFAULT gen_random_uuid()   NOT NULL,
            mentor_id           UUID                                                        NOT NULL,
            tools         TOOLS                                                 NOT NULL,
            created_at          TIMESTAMP WITHOUT TIME ZONE     DEFAULT NOW()               NOT NULL,
            CONSTRAINT fk_mentor_tools FOREIGN KEY (mentor_id) REFERENCES mentor(id) ON DELETE CASCADE,
            PRIMARY KEY(id),
            UNIQUE(mentor_id, tools)
        );
    
        COMMENT ON TABLE mentor_tools IS 'The mentor selected tools for the profile';
        COMMENT ON TYPE TOOLS IS 'All options of tools, used in the tools column type';
        COMMENT ON COLUMN mentor_tools.mentor_id IS 'The UUID of the mentor associated with a specific tool'; 
        COMMENT ON COLUMN mentor_tools.tools IS 'The tool that the mentor specializes in, using the TOOLS enum to ensure valid values';
        COMMENT ON COLUMN mentor_tools.created_at IS 'The mentor_tools create time';
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        DROP TABLE IF EXISTS mentor_tools;
        DROP TYPE IF EXISTS TOOLS;
        ALTER TABLE mentor ADD COLUMN tools JSONB NOT NULL;
    `)
  }
}
