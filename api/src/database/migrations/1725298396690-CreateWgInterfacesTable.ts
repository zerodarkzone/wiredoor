import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateWgInterfacesTable1725298396690 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(new Table({
            name: 'wg_interfaces',
            columns: [
                new TableColumn({
                    name: 'config',
                    type: 'varchar',
                    isNullable: false,
                    isUnique: true,
                    length: '5',
                    isPrimary: true
                }),
                new TableColumn({
                    name: 'name',
                    type: 'varchar',
                    isNullable: false,
                    length: '40'
                }),
                new TableColumn({
                    name: 'address',
                    type: 'varchar',
                    isNullable: false,
                    isUnique: true,
                    length: '18'
                }),
                new TableColumn({
                    name: 'subnet',
                    type: 'varchar',
                    isNullable: false,
                    isUnique: true,
                    length: '18'
                }),
                new TableColumn({
                    name: 'port',
                    type: 'varchar',
                    isNullable: false,
                    isUnique: true,
                    length: '5'
                }),
                new TableColumn({
                    name: 'preUp',
                    type: 'varchar',
                    length: '1024',
                    isNullable: true,
                }),
                new TableColumn({
                    name: 'postUp',
                    type: 'varchar',
                    length: '1024',
                    isNullable: true,
                }),
                new TableColumn({
                    name: 'preDown',
                    type: 'varchar',
                    length: '1024',
                    isNullable: true,
                }),
                new TableColumn({
                    name: 'postDown',
                    type: 'varchar',
                    length: '1024',
                    isNullable: true,
                }),
                new TableColumn({
                    name: 'publicKey',
                    type: 'varchar',
                    isNullable: false,
                }),
                new TableColumn({
                    name: 'privateKey',
                    type: 'varchar',
                    isNullable: false,
                })
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('wg_interfaces');
    }

}
