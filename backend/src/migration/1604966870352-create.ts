import { MigrationInterface, QueryRunner } from 'typeorm';

export class create implements MigrationInterface {

  name = 'create1604966870352'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE usuario (
        id int NOT NULL AUTO_INCREMENT,
        nome varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        senha varchar(255) NULL,
        papel varchar(255) NOT NULL,
        player_id varchar(255) NULL,
        reset_token varchar(255) NULL,
        validade datetime NULL,
        version int NOT NULL,
        created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        UNIQUE INDEX IDX_2863682842e688ca198eb25c12 (email),
        PRIMARY KEY (id)
      ) ENGINE = InnoDB`
    );

    await queryRunner.query(`
      CREATE TABLE grupo (
        id int NOT NULL AUTO_INCREMENT,
        nome varchar(255) NOT NULL,
        version int NOT NULL,
        created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id)
      ) ENGINE = InnoDB`
    );

    await queryRunner.query(`
      CREATE TABLE usuario_grupos_grupo (
        usuarioId int NOT NULL,
        grupoId int NOT NULL,
        INDEX IDX_0ad1490e5e2779e9bac1fd3501 (usuarioId),
        INDEX IDX_3a510b76a524932630463480ae (grupoId),
        PRIMARY KEY (usuarioId, grupoId)
      ) ENGINE = InnoDB`
    );

    await queryRunner.query(`
      ALTER TABLE
        usuario_grupos_grupo
      ADD
        CONSTRAINT FK_0ad1490e5e2779e9bac1fd35010 FOREIGN KEY (usuarioId) REFERENCES usuario(id) ON DELETE CASCADE ON UPDATE NO ACTION`
    );

    await queryRunner.query(`
      ALTER TABLE
        usuario_grupos_grupo
      ADD
        CONSTRAINT FK_3a510b76a524932630463480ae1 FOREIGN KEY (grupoId) REFERENCES grupo(id) ON DELETE CASCADE ON UPDATE NO ACTION`
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE usuario_grupos_grupo DROP FOREIGN KEY FK_3a510b76a524932630463480ae1`);
    await queryRunner.query(`ALTER TABLE usuario_grupos_grupo DROP FOREIGN KEY FK_0ad1490e5e2779e9bac1fd35010`);
    await queryRunner.query(`DROP INDEX IDX_3a510b76a524932630463480ae ON usuario_grupos_grupo`);
    await queryRunner.query(`DROP INDEX IDX_0ad1490e5e2779e9bac1fd3501 ON usuario_grupos_grupo`);
    await queryRunner.query(`DROP TABLE usuario_grupos_grupo`);
    await queryRunner.query(`DROP TABLE grupo`);
    await queryRunner.query(`DROP INDEX IDX_2863682842e688ca198eb25c12 ON usuario`);
    await queryRunner.query(`DROP TABLE usuario`);
  }

}
