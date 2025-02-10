import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateMentorSkills1739172042016 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TYPE DISCIPLINES AS ENUM (
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "TypeScript",
                    "React",
                    "Vue.js",
                    "Angular",
                    "Node.js",
                    "Express.js",
                    "Python",
                    "Django",
                    "Flask",
                    "Ruby",
                    "Ruby on Rails",
                    "Java",
                    "Spring",
                    "PHP",
                    "Laravel",
                    "C#",
                    "ASP.NET",
                    "Swift",
                    "Kotlin",
                    "Flutter",
                    "React Native",
                    "SQL",
                    "NoSQL",
                    "Git",
                    "Docker",
                    "Kubernetes",
                    "CI/CD",
                    "Machine Learning",
                    "Data Analysis",
                    "UI/UX Design",
                    "Adobe Photoshop",
                    "Sketch",
                    "Figma",
                    "InVision",
                    "Prototyping",
                    "Cybersecurity"
            );

            ALTER TABLE mentor DROP COLUMN skills;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(``)
  }
}
