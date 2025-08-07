-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."disciplines" AS ENUM ('Computer Science', 'Engineering', 'Business Administration', 'Medicine', 'Law', 'Design', 'Psychology', 'Biology', 'Economics', 'Sociology');

-- CreateEnum
CREATE TYPE "public"."skills" AS ENUM ('HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Python', 'Django', 'Flask', 'Ruby', 'Ruby on Rails', 'Java', 'Spring', 'PHP', 'Laravel', 'C#', 'ASP.NET', 'Swift', 'Kotlin', 'Flutter', 'React Native', 'SQL', 'NoSQL', 'Git', 'Docker', 'Kubernetes', 'CI/CD', 'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Adobe Photoshop', 'Sketch', 'Figma', 'InVision', 'Prototyping', 'Cybersecurity');

-- CreateEnum
CREATE TYPE "public"."tools" AS ENUM ('React', 'Vue.js', 'Angular', 'HTML', 'CSS', 'JavaScript', 'Node.js', 'Django', 'Flask', 'Ruby on Rails', 'Spring', 'Express.js', 'MEAN Stack', 'MERN Stack', 'LAMP Stack', 'GraphQL', 'Firebase', 'Figma', 'Sketch', 'Adobe XD', 'InVision', 'Axure RP', 'Adobe Photoshop', 'Adobe Illustrator', 'CorelDRAW', 'Affinity Designer', 'Inkscape', 'Docker', 'Kubernetes', 'Jenkins', 'Ansible', 'Terraform', 'React Native', 'Flutter', 'Swift', 'Kotlin', 'Xamarin');

-- CreateEnum
CREATE TYPE "public"."week_days" AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

-- CreateTable
CREATE TABLE "public"."booking" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "host_id" UUID NOT NULL,
    "topic" VARCHAR(30) DEFAULT 'Blank',
    "question" TEXT NOT NULL,
    "picture" VARCHAR(200)[] DEFAULT ARRAY[]::VARCHAR(200)[],
    "booking_status" SMALLINT NOT NULL DEFAULT 0,
    "booking_at" TIMESTAMP(6) NOT NULL,
    "duration" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."booking_member" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,

    CONSTRAINT "booking_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chatroom" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mentor_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."member" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_name" VARCHAR(30) NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(72) NOT NULL,
    "avatar" TEXT NOT NULL,
    "gender" CHAR(1) NOT NULL,
    "country" CHAR(2) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "company" VARCHAR(100) NOT NULL,
    "phone_number" CHAR(20) NOT NULL,
    "email_otp" BOOLEAN NOT NULL DEFAULT false,
    "introduction" TEXT NOT NULL,
    "level" SMALLINT NOT NULL,
    "field_of_work" JSONB NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mentor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_name" VARCHAR(30) NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(72) NOT NULL,
    "avatar" TEXT NOT NULL,
    "gender" CHAR(1) NOT NULL,
    "country" CHAR(2) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "company" VARCHAR(100) NOT NULL,
    "phone_number" CHAR(20) NOT NULL,
    "email_otp" BOOLEAN NOT NULL DEFAULT false,
    "introduction" TEXT NOT NULL,
    "level" SMALLINT NOT NULL DEFAULT 0,
    "url" TEXT NOT NULL,
    "primary_expertise" VARCHAR(100) NOT NULL,
    "secondary_expertise" VARCHAR(100) NOT NULL DEFAULT '',
    "tertiary_expertise" VARCHAR(100) NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quick_reply" BOOLEAN NOT NULL DEFAULT false,
    "experience" JSONB NOT NULL DEFAULT '[]',
    "education" VARCHAR(50) NOT NULL DEFAULT '',

    CONSTRAINT "mentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mentor_available_time" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mentor_id" UUID NOT NULL,
    "day" "public"."week_days" NOT NULL,
    "time_code" INTEGER[],

    CONSTRAINT "mentor_available_time_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mentor_disciplines" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mentor_id" UUID NOT NULL,
    "discipline" "public"."disciplines" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentor_disciplines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mentor_skills" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mentor_id" UUID NOT NULL,
    "skill" "public"."skills" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentor_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mentor_tools" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mentor_id" UUID NOT NULL,
    "tool" "public"."tools" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentor_tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."message" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "chatroom_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."migrations" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "booking_member_booking_id_member_id_key" ON "public"."booking_member"("booking_id", "member_id");

-- CreateIndex
CREATE UNIQUE INDEX "member_email_key" ON "public"."member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mentor_email_key" ON "public"."mentor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mentor_available_time_mentor_id_day_key" ON "public"."mentor_available_time"("mentor_id", "day");

-- CreateIndex
CREATE UNIQUE INDEX "mentor_disciplines_mentor_id_discipline_key" ON "public"."mentor_disciplines"("mentor_id", "discipline");

-- CreateIndex
CREATE UNIQUE INDEX "mentor_skills_mentor_id_skill_key" ON "public"."mentor_skills"("mentor_id", "skill");

-- CreateIndex
CREATE UNIQUE INDEX "mentor_tools_mentor_id_tool_key" ON "public"."mentor_tools"("mentor_id", "tool");

-- AddForeignKey
ALTER TABLE "public"."booking" ADD CONSTRAINT "fk_booking_mentor" FOREIGN KEY ("host_id") REFERENCES "public"."mentor"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."booking_member" ADD CONSTRAINT "fk_booking" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."booking_member" ADD CONSTRAINT "fk_booking_member_id" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."chatroom" ADD CONSTRAINT "fk_chatroom_member" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."chatroom" ADD CONSTRAINT "fk_chatroom_mentor" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mentor_available_time" ADD CONSTRAINT "fk_mentor_available_time" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mentor_disciplines" ADD CONSTRAINT "fk_mentor_discipline" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mentor_skills" ADD CONSTRAINT "fk_mentor_skill" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mentor_tools" ADD CONSTRAINT "fk_mentor_tool" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."message" ADD CONSTRAINT "fk_message_chatroom" FOREIGN KEY ("chatroom_id") REFERENCES "public"."chatroom"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

