import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateNodesTable1725299062001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'nodes',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'int',
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true,
          }),
          new TableColumn({
            name: 'name',
            type: 'varchar',
            isNullable: false,
            length: '40',
          }),
          new TableColumn({
            name: 'address',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
            length: '15',
          }),
          new TableColumn({
            name: 'wgInterface',
            type: 'varchar',
            default: "'wg0'",
            isNullable: false,
          }),
          new TableColumn({
            name: 'preSharedKey',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'privateKey',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'publicKey',
            type: 'varchar',
            isNullable: false,
          }),
          new TableColumn({
            name: 'allowInternet',
            type: 'boolean',
            isNullable: false,
            default: false,
          }),
          new TableColumn({
            name: 'enabled',
            type: 'boolean',
            isNullable: false,
            default: true,
          }),
          new TableColumn({
            name: 'created_at',
            type: 'datetime',
            default: 'now()',
          }),
          new TableColumn({
            name: 'updated_at',
            type: 'datetime',
            default: 'now()',
          }),
        ],
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
