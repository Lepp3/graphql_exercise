import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateOrderTable1753181759388 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "order_type_enum" AS ENUM ('shipment', 'delivery')`);

    await queryRunner.createTable(
      new Table({
        name: 'order',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'company_id', type: 'uuid', isNullable: false },
          { name: 'user_id', type: 'uuid', isNullable: false },
          { name: 'warehouse_id', type: 'uuid', isNullable: false },
          { name: 'partner_id', type: 'uuid', isNullable: false },
          {
            name: 'type',
            type: 'order_type_enum',
            isNullable: false,
          },
          { name: 'date', type: 'date', isNullable: false, default: 'now()' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
          { name: 'modified_by', type: 'uuid', isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'company',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['warehouse_id'],
        referencedTableName: 'warehouse',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['partner_id'],
        referencedTableName: 'partner',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['modified_by'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('order');

    const dropFk = (column: string, ref: string) =>
      table?.foreignKeys.find(
        (fk) =>
          fk.columnNames.includes(column) && fk.referencedTableName === ref,
      );

    const fks = [
      dropFk('modified_by', 'user'),
      dropFk('partner_id', 'partner'),
      dropFk('warehouse_id', 'warehouse'),
      dropFk('user_id', 'user'),
      dropFk('company_id', 'company'),
    ];

    for (const fk of fks) {
      if (fk) await queryRunner.dropForeignKey('order', fk);
    }

    await queryRunner.dropTable('order');
    await queryRunner.query(`DROP TYPE "order_type_enum"`);
  }
}
