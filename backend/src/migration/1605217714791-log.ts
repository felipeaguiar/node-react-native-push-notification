import { MigrationInterface, QueryRunner } from 'typeorm';

export class log1605217714791 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE log (
        id int NOT NULL AUTO_INCREMENT,
        level varchar(16) NOT NULL,
        message varchar(512) NOT NULL,
        meta varchar(1024) NOT NULL,
        timestamp datetime NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE = InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE log`
    );
  }

}
