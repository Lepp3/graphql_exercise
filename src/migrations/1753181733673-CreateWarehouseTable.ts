import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateWarehouseTable1753181733673 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
         CREATE TYPE "warehouse_support_type_enum" AS ENUM ('liquid', 'solid')`);

    await queryRunner.createTable(
      new Table({
        name: 'warehouse',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'company_id', type: 'uuid', isNullable: false },
          { name: 'name', type: 'varchar', isNullable: false },
          {
            name: 'support_type',
            type: 'warehouse_support_type_enum',
            isNullable: false,
          },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
          { name: 'modified_by', type: 'uuid', isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'warehouse',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'company',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'warehouse',
      new TableForeignKey({
        columnNames: ['modified_by'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('warehouse');

    const companyFk = table?.foreignKeys.find(
      (fk) =>
        fk.columnNames.includes('company_id') &&
        fk.referencedTableName === 'company',
    );

    const modifiedByFk = table?.foreignKeys.find(
      (fk) =>
        fk.columnNames.includes('modified_by') &&
        fk.referencedTableName === 'user',
    );

    if (modifiedByFk)
      await queryRunner.dropForeignKey('warehouse', modifiedByFk);
    if (companyFk) await queryRunner.dropForeignKey('warehouse', companyFk);

    await queryRunner.dropTable('warehouse');
    await queryRunner.query(`DROP TYPE "warehouse_support_type_enum"`);
  }
}
