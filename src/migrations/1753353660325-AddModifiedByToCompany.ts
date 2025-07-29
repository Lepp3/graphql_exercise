import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddModifiedByToCompany1753353660325 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "company"
      ADD COLUMN "modified_by" uuid NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "company"
      ADD CONSTRAINT "FK_company_modified_by"
      FOREIGN KEY ("modified_by") REFERENCES "user"("id") ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "company"
      DROP CONSTRAINT "FK_company_modified_by"
    `);

    await queryRunner.query(`
      ALTER TABLE "company"
      DROP COLUMN "modified_by"
    `);
  }
}
