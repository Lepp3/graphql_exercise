import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateProductTable1753181752178 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "product_support_type_enum" AS ENUM ('liquid', 'solid')`);

    await queryRunner.createTable(
      new Table({
        name: 'product',
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
            name: 'type',
            type: 'product_support_type_enum',
            isNullable: false,
          },
          { name: 'code', type: 'varchar', isNullable: false },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
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
      'product',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'company',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        columnNames: ['modified_by'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product');

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

    if (modifiedByFk) {
      await queryRunner.dropForeignKey('product', modifiedByFk);
    }

    if (companyFk) {
      await queryRunner.dropForeignKey('product', companyFk);
    }

    await queryRunner.dropTable('product');
    await queryRunner.query(`DROP TYPE "product_support_type_enum"`);
  }
}
