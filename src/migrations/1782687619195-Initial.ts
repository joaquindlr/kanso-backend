import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1782687619195 implements MigrationInterface {
  name = 'Initial1782687619195';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "epics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "project_id" uuid NOT NULL, "title" character varying(150) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_aa782b1b14b73c7a38f04b71e3f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."issues_type_enum" AS ENUM('STORY', 'BUG')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."issues_status_enum" AS ENUM('ICEBOX', 'NEW', 'IN_PROGRESS', 'DONE', 'DEPLOYED', 'CLOSED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."issues_severity_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "issues" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "project_id" uuid NOT NULL, "epic_id" uuid, "key" character varying(20) NOT NULL, "type" "public"."issues_type_enum" NOT NULL, "title" character varying(150) NOT NULL, "detail" text, "status" "public"."issues_status_enum" NOT NULL DEFAULT 'NEW', "position" character varying(255) NOT NULL, "severity" "public"."issues_severity_enum" NOT NULL DEFAULT 'MEDIUM', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9d8ecbbeff46229c700f0449257" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "name" character varying(100) NOT NULL, "prefix" character varying(10) NOT NULL DEFAULT 'PROJ', "issue_sequence" integer NOT NULL DEFAULT '0', "description" text, "excalidraw_data" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "user_id" uuid NOT NULL, "issue_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "epics" ADD CONSTRAINT "FK_dc579be47613cc4f616845d0bff" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "issues" ADD CONSTRAINT "FK_11f35e8296e10c229e7b68c68d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "issues" ADD CONSTRAINT "FK_5e2430bd5e02134ed0b79d3b5f8" FOREIGN KEY ("epic_id") REFERENCES "epics"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_bd55b203eb9f92b0c8390380010" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_4ce924bcd63bee0fccc7fe1d8f6" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_4ce924bcd63bee0fccc7fe1d8f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_bd55b203eb9f92b0c8390380010"`,
    );
    await queryRunner.query(
      `ALTER TABLE "issues" DROP CONSTRAINT "FK_5e2430bd5e02134ed0b79d3b5f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "issues" DROP CONSTRAINT "FK_11f35e8296e10c229e7b68c68d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "epics" DROP CONSTRAINT "FK_dc579be47613cc4f616845d0bff"`,
    );
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "issues"`);
    await queryRunner.query(`DROP TYPE "public"."issues_severity_enum"`);
    await queryRunner.query(`DROP TYPE "public"."issues_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."issues_type_enum"`);
    await queryRunner.query(`DROP TABLE "epics"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
